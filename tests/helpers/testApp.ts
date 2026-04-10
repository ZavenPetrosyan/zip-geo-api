import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import { buildApp } from '../../src/app.js';
import { Location } from '../../src/db/models/location.model.js';

export async function buildTestApp(): Promise<FastifyInstance> {
  const testDbUri = 'mongodb://localhost:27017/zipgeo-test';
  await mongoose.connect(testDbUri);

  await Location.createIndexes();

  const app = await buildApp();
  await app.ready();

  return app;
}

export async function closeTestApp(app: FastifyInstance): Promise<void> {
  await app.close();
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}
