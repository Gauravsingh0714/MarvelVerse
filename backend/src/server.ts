import app from './app/index.js';
import { ENV } from './config/env.js';
import { logger } from './logger/index.js';

let server: any;

export const startServer = () => {
  server = app.listen(ENV.PORT, () => {
    logger.info(
      `🚀 Server running on port ${ENV.PORT} in ${ENV.NODE_ENV} mode`
    );
  });

  return server;
};

export const stopServer = () => {
  if (server) {
    server.close(() => {
      logger.info('🛑 Server stopped');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  stopServer();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  stopServer();
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught Exception');
  stopServer();
});

process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'Unhandled Rejection');
  stopServer();
});
