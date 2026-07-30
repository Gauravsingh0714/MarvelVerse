import { Request, Response } from 'express';
import { ENV } from '../config/env.js';

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV,
    version: '0.1.0',
  });
};
