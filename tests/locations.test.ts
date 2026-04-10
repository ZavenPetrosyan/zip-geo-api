import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildTestApp, closeTestApp } from './helpers/testApp.js';
import { Location } from '../src/db/models/location.model.js';

describe('Locations API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildTestApp();

    await Location.create([
      {
        zip: '10001',
        city: 'New York',
        state: 'NY',
        county: 'New York County',
        timezone: 'America/New_York',
        population: 21102,
        location: {
          type: 'Point',
          coordinates: [-73.9967, 40.7506],
        },
      },
      {
        zip: '90001',
        city: 'Los Angeles',
        state: 'CA',
        county: 'Los Angeles County',
        timezone: 'America/Los_Angeles',
        population: 57110,
        location: {
          type: 'Point',
          coordinates: [-118.2480, 33.9731],
        },
      },
      {
        zip: '90210',
        city: 'Beverly Hills',
        state: 'CA',
        county: 'Los Angeles County',
        timezone: 'America/Los_Angeles',
        population: 21733,
        location: {
          type: 'Point',
          coordinates: [-118.4065, 34.0901],
        },
      },
    ]);
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('forward lookup returns results', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/search?q=New York',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.count).toBeGreaterThan(0);
    expect(body.meta.took_ms).toBeGreaterThanOrEqual(0);
  });

  it('forward lookup 400 on missing q param', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/search',
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toBeDefined();
  });

  it('reverse lookup returns nearest location', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/reverse?lat=40.7506&lng=-73.9967',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toBeDefined();
    expect(body.data.zip).toBe('10001');
    expect(body.count).toBe(1);
    expect(body.meta.took_ms).toBeGreaterThanOrEqual(0);
  });

  it('reverse lookup 400 on invalid coordinates', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/reverse?lat=100&lng=-73.9967',
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.message).toBeDefined();
  });

  it('radius search returns locations', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/radius?lat=40.7506&lng=-73.9967&km=5000',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.count).toBeGreaterThan(0);
    expect(body.meta.took_ms).toBeGreaterThanOrEqual(0);
  });

  it('radius search returns empty array not 404 when no results', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/radius?lat=0&lng=0&km=1',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toEqual([]);
    expect(body.count).toBe(0);
    expect(body.meta.took_ms).toBeGreaterThanOrEqual(0);
  });

  it('unknown route returns 404', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/unknown',
    });

    expect(response.statusCode).toBe(404);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('NOT_FOUND');
    expect(body.message).toBeDefined();
  });

  it('forward lookup works with ZIP code', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/locations/search?q=90210',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].zip).toBe('90210');
  });
});
