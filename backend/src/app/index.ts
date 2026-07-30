import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger/index.js';
import { errorHandler, notFoundHandler } from '../middleware/errorHandler.js';
import v1Routes from '../routes/v1.js';
import { ENV } from '../config/env.js';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Middleware
app.use(helmet());
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Request ID and Logger
app.use((req, _res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  next();
});

// @ts-ignore
app.use(
  pinoHttp({
    logger,
    genReqId: (req: any) => req.id,
  })
);

// Routes
app.use('/api/v1', v1Routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
