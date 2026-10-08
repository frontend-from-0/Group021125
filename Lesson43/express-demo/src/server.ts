import app from './app'
import * as os from 'os'
import logger from './common/logger'
import {db} from './prisma/db';

// to use env variables
import './common/env';

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port ${PORT}`);
})

function shutdown(signal: string) {
  logger.info(`Received ${signal}, closing server`);
  server.close(() => {
    void db.close().then(() => {
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

