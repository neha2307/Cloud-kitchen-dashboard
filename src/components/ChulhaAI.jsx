import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Sparkles, Send, RotateCcw, AlertTriangle, Maximize2, X } from 'lucide-react'
import { useOrders } from '../context/OrdersContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { buildDashboardContext } from '../lib/dashboardContext.js'

const STARTERS = [
  'What should I focus on right now?',
  'Which dish should I promote today?',
  'How can I get more repeat customers?',
  'Analyse today’s performance so far',
  'What’s hurting my revenue?',
]

// Parse the Anthropic SSE stream we're forwarding. Yields plain text deltas.
async function* readStream(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE events are separated by \n\n
    let idx
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const raw = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)

      // Each event may have "event: ..." + "data: ..." lines
      const dataLines = raw.split('\n').filter(l => l.startsWith('data: '))
      if (dataLines.length === 0) continue
      const payload = dataLines.map(l => l.slice(6)).join('\n')
      if (payload === '[DONE]') return
      try {
        const obj = JSON.parse(payload)
        if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta') {
          yield obj.delta.text || ''
        } else if (obj.type === 'message_stop') {
          return
        } else if (obj.type === 'error') {
          throw new Error(obj.error?.message || 'Upstream error')
        }
      } catch (err) {
        // Non-JSON lines (heartbeats) — skip.
        if (err instanceof SyntaxError) continue
        throw err
      }
    }
  }
}

function formatTime(d = new Date()) {
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

function AvatarBadge() {
  return (
    <div
      className="h-7 w-7 rounded-xl grid place-items-center shrink-0
                 bg-gradient-to-br from-saffron-400 to-saffron-600 text-white shadow-soft"
      aria-hidden
    >
      <Sparkles className="h-3.5 w-3.5" />
    </div>
  )
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 text-ink-400 dark:text-ink-300" aria-label="Thinking">
      <span className="chulha-dot" />
      <span className="chulha-dot" />
      <span className="chulha-dot" />
    </span>
  )
}

function Bubble({ role, text, time, streaming, error, onRetry }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-saffron-500 text-white px-3.5 py-2.5 shadow-soft">
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</div>
          {time && <div className="text-[10px] opacity-80 mt-1 text-right">{time}</div>}
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-2.5">
      <AvatarBadge />
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-cream-100 dark:bg-ink-700/60 px-3.5 py-2.5">
        {error ? (
          <div className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div>{text || 'Something went wrong.'}</div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-1.5 text-xs font-semibold text-saffron-600 dark:text-saffron-300 hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-ink-800 dark:text-cream-50">
              {text || (streaming ? <TypingDots /> : '')}
              {streaming && text && <span className="inline-block w-1.5 h-4 align-middle bg-ink-300 dark:bg-ink-500 ml-0.5 animate-pulse" />}
            </div>
            {time && !streaming && (
              <div className="text-[10px] text-ink-400 dark:text-ink-300 mt-1">{time}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ChulhaAI() {
  const { orders } = useOrders()
  const { user } = useAuth()
  const ctx = useMemo(() => buildDashboardContext({ orders, user }), [orders, user])
  const ownerFirst = ctx.ownerFirstName

  const [messages, setMessages] = useState([]) // {role,text,time,error?}
  const [streaming, setStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [expanded, setExpanded] = useState(false)
  const abortRef = useRef(null)
  const scrollRef = useRef(null)
  const streamTextRef = useRef('') // accumulates during streaming

  const isEmpty = messages.length === 0

  // Auto-scroll to latest message inside the chat area.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, streaming])

  // Esc closes expanded mode on desktop.
  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  const send = useCallback(async (text) => {
    const trimmed = text.trim()
    if (!trimmed || streaming) return

    const userMsg = { role: 'user', text: trimmed, time: formatTime() }
    // Drop any trailing error bubble before re-asking.
    const base = messages.filter((m, i) => !(i === messages.length - 1 && m.error))
    const history = [...base, userMsg]
    setMessages([...history, { role: 'assistant', text: '', streaming: true }])
    setStreaming(true)
    setInput('')
    streamTextRef.current = ''

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.text })),
          context: ctx,
        }),
        signal: controller.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'The assistant is unreachable right now.')
      }

      for await (const chunk of readStream(res)) {
        streamTextRef.current += chunk
        const current = streamTextRef.current
        setMessages(prev => {
          const copy = prev.slice()
          copy[copy.length - 1] = { role: 'assistant', text: current, streaming: true }
          return copy
        })
      }

      // Finalize the streamed bubble.
      setMessages(prev => {
        const copy = prev.slice()
        copy[copy.length - 1] = {
          role: 'assistant',
          text: streamTextRef.current,
          time: formatTime(),
        }
        return copy
      })
    } catch (err) {
      const msg = err.name === 'AbortError'
        ? 'Stopped.'
        : (err.message || 'Something went wrong.')
      setMessages(prev => {
        const copy = prev.slice()
        copy[copy.length - 1] = { role: 'assistant', error: true, text: msg }
        return copy
      })
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }, [messages, streaming, ctx])

  const retry = useCallback(() => {
    // Find the last user message that preceded the error bubble, then resend.
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (!lastUser) return
    // Strip the error and the last user msg from history (we'll re-add).
    setMessages(prev => prev.slice(0, Math.max(0, prev.length - 2)))
    send(lastUser.text)
  }, [messages, send])

  const clearChat = () => {
    if (streaming && abortRef.current) abortRef.current.abort()
    setMessages([])
    setInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  // The card body — shared between inline and expanded modes.
  const body = (
    <>
      {/* Scrolling chat area */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto pr-0.5 space-y-3 ${expanded ? '' : 'min-h-[180px] max-h-[280px]'}`}
      >
        {isEmpty ? (
          <div className="flex items-start gap-2.5">
            <AvatarBadge />
            <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-cream-100 dark:bg-ink-700/60 px-3.5 py-2.5">
              <div className="text-sm leading-relaxed text-ink-800 dark:text-cream-50">
                Good {ctx.localHour < 12 ? 'morning' : ctx.localHour < 17 ? 'afternoon' : 'evening'}, {ownerFirst}.
                I’ve got today’s numbers ready — ask me anything, or tap a starter below.
              </div>
              <div className="text-[10px] text-ink-400 dark:text-ink-300 mt-1">Based on today’s data</div>
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <Bubble
              key={i}
              role={m.role}
              text={m.text}
              time={m.time}
              streaming={m.streaming}
              error={m.error}
              onRetry={m.error && i === messages.length - 1 ? retry : null}
            />
          ))
        )}
      </div>

      {/* Starter prompt chips — only while chat is empty */}
      {isEmpty && (
        <div className="flex flex-wrap gap-2 mt-3">
          {STARTERS.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={streaming}
              className="chip bg-white dark:bg-ink-700 border border-ink-200 dark:border-ink-600 text-ink-700 dark:text-ink-100 hover:bg-cream-50 dark:hover:bg-ink-600 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSubmit} className="mt-3 flex items-end gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 focus-within:border-saffron-500 focus-within:ring-2 focus-within:ring-saffron-500/20">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={streaming ? 'Still answering…' : `Ask Chulha AI…`}
            disabled={streaming}
            aria-label="Message Chulha AI"
            className="bg-transparent outline-none flex-1 text-sm placeholder-ink-300 dark:placeholder-ink-500 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="btn-primary !px-3 !py-2.5 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </>
  )

  // Header row — reused in both modes.
  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <AvatarBadge />
        <div className="min-w-0">
          <div className="font-display font-bold text-ink-800 dark:text-cream-50 truncate">
            Chulha AI
          </div>
          <div className="text-[11px] text-ink-400 dark:text-ink-300 truncate">
            Your smart kitchen assistant
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="btn-ghost !p-2 rounded-lg"
            title="Clear chat"
            aria-label="Clear chat"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="btn-ghost !p-2 rounded-lg"
          title={expanded ? 'Close' : 'Expand chat'}
          aria-label={expanded ? 'Close expanded chat' : 'Expand chat'}
        >
          {expanded ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Inline card */}
      <div className="card p-5 flex flex-col gap-3">
        {header}
        {body}
      </div>

      {/* Expanded: mobile bottom sheet / desktop side panel */}
      {expanded && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink-900/40 animate-backdrop"
            onClick={() => setExpanded(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-label="Chulha AI chat"
            className="
              fixed z-50 bg-white dark:bg-ink-800
              left-0 right-0 bottom-0 max-h-[88vh] rounded-t-3xl p-5 pb-8
              sm:left-auto sm:right-6 sm:top-20 sm:bottom-6 sm:w-[440px] sm:rounded-2xl sm:max-h-none
              animate-sheet flex flex-col gap-3
              shadow-pop
            "
          >
            {header}
            {body}
          </div>
        </>
      )}
    </>
  )
}
