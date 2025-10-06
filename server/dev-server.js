import { createServer } from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = createServer();
const requestedPort = process.argv[2] ? parseInt(process.argv[2], 10) : undefined;
const port = requestedPort || process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is already in use. Assuming server is already running. Skipping start.`);
    process.exit(0);
  }
  throw err;
});
