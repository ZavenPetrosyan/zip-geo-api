import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { connectDB, disconnectDB } from '../src/db/connection.js';
import { Location } from '../src/db/models/location.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CSVRow {
  zip: string;
  lng: string;
  lat: string;
  city: string;
  state_id: string;
  state_name: string;
  county_name?: string;
  timezone?: string;
  population?: string;
}

async function ingest() {
  const startTime = Date.now();

  await connectDB();

  const csvPath = path.join(__dirname, 'data', 'us-zip-codes.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CSVRow[];

  const documents = records
    .filter(row => row.zip && row.city && row.state_id && row.lat && row.lng)
    .map(row => ({
      zip: row.zip,
      city: row.city,
      state: row.state_id,
      county: row.county_name || undefined,
      timezone: row.timezone || undefined,
      population: row.population ? parseInt(row.population, 10) : undefined,
      location: {
        type: 'Point' as const,
        coordinates: [parseFloat(row.lng), parseFloat(row.lat)] as [number, number],
      },
    }));

  if (documents.length > 0) {
    console.log('First parsed row:', JSON.stringify(documents[0], null, 2));
  }

  const batchSize = 500;
  let upserted = 0;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const bulkOps = batch.map(record => ({
      updateOne: {
        filter: { zip: record.zip },
        update: { $set: record },
        upsert: true,
      },
    }));

    await Location.bulkWrite(bulkOps);
    upserted += batch.length;
    console.log(`Upserted ${upserted} / ${documents.length} documents`);
  }

  const elapsed = Date.now() - startTime;
  console.log(`Ingestion complete. Total upserted: ${upserted} documents in ${elapsed}ms`);

  await disconnectDB();
}

ingest();
