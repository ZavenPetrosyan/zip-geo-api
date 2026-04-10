# ZIP Geo API

A production-minded geocoding API built on US ZIP code data.
Supports forward lookup, reverse geocoding, and radius search.

Stack: Node.js 22 · TypeScript · Fastify · MongoDB · Mongoose · Vitest

## Architecture

Four-layer architecture:
- Routes — HTTP routing only
- Controller — request parsing and response shaping
- Service — business logic
- Repository — all database queries

## Technical Decisions

### Database: MongoDB with 2dsphere index
Chose MongoDB over PostgreSQL + PostGIS because the ZIP code
data maps naturally to GeoJSON documents, the 2dsphere index
handles all three query types natively, and setup requires
no extensions. PostGIS would be the right choice if query
complexity grew to include polygon intersections or routing.

### Framework: Fastify
Chosen for its performance, first-class TypeScript support,
and plugin-based architecture. Error handling and logging
are Fastify plugins, not Express-style middleware.

### Indexing strategy
Three indexes on the locations collection:
- 2dsphere on location field — enables O(log n) radius
  and reverse lookup queries
- Text index on city + state — enables fast autocomplete
  without a separate search service
- B-tree index on zip — exact ZIP code lookups

### Validation
Route-level validation uses Fastify's built-in JSON Schema
(AJV) on all query parameters — required fields, type
coercion, and range constraints are enforced before
requests reach the controller. Validation errors return
a consistent 400 response shape.

## API Reference

### Forward lookup
GET /api/v1/locations/search?q=Beverly+Hills&state=CA

### Reverse lookup
GET /api/v1/locations/reverse?lat=34.09&lng=-118.40

### Radius search
GET /api/v1/locations/radius?lat=34.09&lng=-118.40&km=50

Full interactive docs available at /docs when running.

## Response shape

All endpoints return a consistent envelope:

Success:
{
  "data": <object or array>,
  "count": <number>,
  "meta": { "took_ms": <number> }
}

Error:
{
  "error": "VALIDATION_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR",
  "message": "<human readable description>"
}

## Setup

Requirements: Node.js 22+, Docker, Docker Compose

```bash
# Clone and setup
git clone https://github.com/ZavenPetrosyan/zip-geo-api
cd zip-geo-api
cp .env.example .env

# Start MongoDB
docker-compose up mongo -d

# Download dataset from https://simplemaps.com/data/us-zips
# Save CSV as scripts/data/us-zip-codes.csv

# Ingest data
npm run ingest

# Start API
npm run dev
```

## Testing

```bash
npm test
```

7 integration tests covering all critical paths.

## Known Limitations

- No pagination on search results (default limit: 10)
- Text search requires exact word matches —
  partial prefix search would need a different index strategy
- No auth or rate limiting

## What I'd tackle next

- Add pagination with cursor-based navigation
- Replace text index with regex or Atlas Search
  for better autocomplete (prefix matching)
- Add Redis caching for hot queries
- Add rate limiting with @fastify/rate-limit
- Add Prometheus metrics endpoint
- Deploy to AWS with ECS + DocumentDB
  (managed MongoDB-compatible service — no operational overhead)
