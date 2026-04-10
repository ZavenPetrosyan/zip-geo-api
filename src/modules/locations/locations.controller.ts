import { FastifyRequest, FastifyReply } from 'fastify';
import { LocationsService } from './locations.service.js';

export class LocationsController {
  private service: LocationsService;

  constructor(service: LocationsService) {
    this.service = service;
  }

  forwardSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    const start = Date.now();
    const params = request.query as { q: string; state?: string; limit?: number };

    const results = await this.service.forwardSearch({
      zip: params.q,
      state: params.state,
      limit: params.limit,
    });

    return reply.send({
      data: results,
      count: results.length,
      meta: {
        took_ms: Date.now() - start,
      },
    });
  };

  reverseSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    const start = Date.now();
    const params = request.query as { lat: number; lng: number };

    const result = await this.service.reverseSearch({
      latitude: params.lat,
      longitude: params.lng,
    });

    return reply.send({
      data: result,
      count: result ? 1 : 0,
      meta: {
        took_ms: Date.now() - start,
      },
    });
  };

  radiusSearch = async (request: FastifyRequest, reply: FastifyReply) => {
    const start = Date.now();
    const params = request.query as { lat: number; lng: number; km: number; limit?: number };

    const results = await this.service.radiusSearch({
      latitude: params.lat,
      longitude: params.lng,
      radius: params.km,
      limit: params.limit,
    });

    return reply.send({
      data: results,
      count: results.length,
      meta: {
        took_ms: Date.now() - start,
      },
    });
  };
}
