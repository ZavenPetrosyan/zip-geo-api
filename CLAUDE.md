We are building a ZIP code geocoding API.

Stack: Node.js 22, TypeScript strict, Fastify 5, MongoDB 7,
Mongoose 8, Zod validation, Pino logging, Vitest testing.

Four-layer architecture — strictly enforced:
- routes: HTTP only, no business logic
- controller: parse request, call service, shape response
- service: business rules, calls repository only
- repository: all Mongoose queries, no HTTP knowledge

Error responses shape:
{ "error": "ERROR_CODE", "message": "human readable" }

Success response shape:
{ "data": T, "count": number, "meta": { "took_ms": number } }

GeoJSON coordinates are always [longitude, latitude].
2dsphere index is on the location field in Mongoose.

Plugins live in src/plugins/ — not middleware/.
Error handling is a Fastify plugin, not Express middleware.

Do not add comments explaining what code does.
Do not install packages not in the agreed list.
Do not use any, cast to unknown first then the target type.
