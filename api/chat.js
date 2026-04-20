// Chulha AI proxy to Anthropic.
// Keeps ANTHROPIC_API_KEY server-side. Browser never sees it.
//
// Runs in two environments:
//   1. Vercel serverless (default export: (req, res))
//   2. Vite dev middleware (imported from vite.config.js and called with the
//      same Node IncomingMessage / ServerResponse pair)
//
// Streaming: we forward Anthropic's SSE stream verbatim to the client.
// The browser renders tokens as they arrive via EventSource-style parsing.

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 600

function systemPromptFor(context) {
  const {
    ownerFirstName = 'Priya',
    kitchenName = 'Masala Home Kitchen',
    ordersToday = 0,
    revenueToday = 0,
    topDish = '—',
    avgTicketSize = 0,
    sourceMix = 'WhatsApp 46%, Instagram 22%, Website 21%, Repeat 11%',
    pendingOrders = 0,
    pendingOrderSummaries = '',
    alerts = '',
    outOfStock = '',
    repeatCustomers = '',
    localHour = new Date().getHours(),
  } = context || {}

  const greetWindow =
    localHour < 12 ? 'morning' : localHour < 17 ? 'afternoon' : 'evening'

  return `You are Chulha AI, a smart business assistant built into the ${kitchenName} dashboard in Bengaluru, India.

You help the owner ${ownerFirstName} make fast, confident decisions about her home kitchen business. It is currently ${greetWindow} in Bengaluru.

Today's live data (only source of truth — do not invent numbers outside this block):
- Orders today: ${ordersToday}
- Revenue today: ₹${revenueToday}
- Top selling dish: ${topDish}
- Avg ticket size: ₹${avgTicketSize}
- Order sources: ${sourceMix}
- Pending orders right now: ${pendingOrders}${pendingOrderSummaries ? `\n- Pending order details: ${pendingOrderSummaries}` : ''}${alerts ? `\n- Active alerts: ${alerts}` : ''}${outOfStock ? `\n- Out of stock items: ${outOfStock}` : ''}${repeatCustomers ? `\n- Notable repeat customers: ${repeatCustomers}` : ''}

Rules:
- Be concise — owner is busy cooking. Default to 2–3 short sentences or 3 bullets.
- Always give one specific action she can take right now.
- Use INR (₹) for all currency. Indian English tone, warm and practical.
- Speak like a trusted business advisor, not a chatbot. Use her first name sparingly.
- Never mention Claude, Anthropic, or AI models. You are "Chulha AI".
- Only cite numbers from the live data block above. If a number isn't there, say you don't have it yet.
- If a question is outside running this kitchen, reply in one line that it's outside your scope.
- Keep responses under 150 words unless she explicitly asks for detail.`
}

function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body)
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      error: 'missing_api_key',
      message: 'ANTHROPIC_API_KEY is not configured on the server.',
    }))
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'invalid_json' }))
    return
  }

  const { messages = [], context = {} } = body
  if (!Array.isArray(messages) || messages.length === 0) {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'messages_required' }))
    return
  }

  // Guard: keep only the last 10 turns to avoid runaway tokens.
  const trimmed = messages.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 4000),
  }))

  let upstream
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPromptFor(context),
        messages: trimmed,
        stream: true,
      }),
    })
  } catch (err) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'upstream_unreachable', message: String(err?.message || err) }))
    return
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => '')
    // Try to extract the human-readable message from Anthropic's error JSON.
    let friendly = ''
    try {
      const parsed = JSON.parse(text)
      friendly = parsed?.error?.message || ''
    } catch {}
    res.statusCode = upstream.status || 502
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({
      error: 'upstream_error',
      status: upstream.status,
      message: friendly || 'The assistant is temporarily unavailable. Please try again in a moment.',
    }))
    return
  }

  // Stream SSE chunks straight to the client.
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache, no-transform')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const reader = upstream.body.getReader()
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      if (value) res.write(Buffer.from(value))
    }
  } catch (err) {
    // Client likely disconnected; just end the stream.
  } finally {
    try { res.end() } catch {}
  }
}
