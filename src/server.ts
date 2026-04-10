import { buildApp } from './app.js';
import { connectDB } from './db/connection.js';
import { env } from './config/env.js';

async function start() {
  await connectDB();

  const app = await buildApp();

  await app.listen({ port: env.PORT, host: '0.0.0.0' });
}

start();
