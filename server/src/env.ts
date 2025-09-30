import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '..', '.env') });

export const ENV = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  frontendUrl: process.env.FRONTEND_URL || '*',
  apiBaseUrl: process.env.ZAPPY_API_BASE_URL || 'https://api-stag.zappyhealth.com/api/v1',
  apiKey: process.env.ZAPPY_API_KEY || '',
};
