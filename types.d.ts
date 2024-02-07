import type { Config } from './src/types/config/index'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Config {
      users: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export { }
