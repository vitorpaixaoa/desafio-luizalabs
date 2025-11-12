import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useHttps = env.VITE_DEV_HTTPS === 'true'
  const hmrHost = env.HMR_HOST
  const hmrClientPort = env.HMR_CLIENT_PORT ? Number(env.HMR_CLIENT_PORT) : undefined
  const hmrProtocol = env.HMR_PROTOCOL as 'ws' | 'wss' | undefined

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src/app'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    },
    server: (() => {
      const base: any = {
        port: 5173,
        host: true
      }
      if (useHttps) base.https = true
      if (hmrHost || hmrClientPort || hmrProtocol) {
        base.hmr = {
          host: hmrHost,
          clientPort: hmrClientPort,
          protocol: hmrProtocol
        }
      }
      return base
    })(),
    preview: {
      port: 5173,
      host: true
    }
  }
})


