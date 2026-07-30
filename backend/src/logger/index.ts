import pino from 'pino';
import { ENV } from '../config/env.js';

export const logger = pino({
  level: ENV.LOG_LEVEL || 'info',
  transport:
    ENV.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
});
