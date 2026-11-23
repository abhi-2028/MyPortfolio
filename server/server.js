import 'dotenv/config';

import app from './src/app.js';
import { connectDatabase, disconnectDatabase } from './src/config/database.js';

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace-with-a-long-random-secret') {
      throw new Error('JWT_SECRET must be set to a secure value.');
    }
    await connectDatabase();

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server.`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Unable to start the portfolio API.');
    console.error(error.message);
    process.exitCode = 1;
  }
};

startServer();
