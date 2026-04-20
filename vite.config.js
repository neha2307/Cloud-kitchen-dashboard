import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only plugin: expose /api/chat locally by importing the same handler
// that Vercel will run in production. Loads .env.local into process.env so
// the handler can read ANTHROPIC_API_KEY.
function chulhaApiDevPlugin() {
  return {
    name: 'chulha-api-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) {
        process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
      }

      server.middlewares.use('/api/chat', async (req, res, next) => {
        try {
          const mod = await server.ssrLoadModule('/api/chat.js')
          await mod.default(req, res)
        } catch (err) {
          // Log the stack to the server console; send a calm JSON error.
          // eslint-disable-next-line no-console
          console.error('[chulha-api-dev]', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'dev_handler_failed', message: String(err?.message || err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), chulhaApiDevPlugin()],
  server: { port: 5173 },
})
