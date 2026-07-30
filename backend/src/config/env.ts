import { z } from 'zod';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const env = dotenv.config();
dotenvExpand.expand(env);

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.string().default('info'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://user:password@localhost:5432/marvelverse'),
  JWT_SECRET: z.string().min(1).default('secret'),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('? Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const ENV = _env.data;
