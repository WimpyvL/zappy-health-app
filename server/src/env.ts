import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(process.cwd(), '..', '.env') })

const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const

type EnvKey = typeof requiredEnvVars[number]

const missing = requiredEnvVars.filter((key) => !process.env[key])

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}`)
}

export const ENV = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  supabaseUrl: process.env.SUPABASE_URL as string,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  frontendUrl: process.env.FRONTEND_URL || '*'
}
