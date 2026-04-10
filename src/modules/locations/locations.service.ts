import { LocationsRepository } from './locations.repository.js';
import {
  ForwardSearchParams,
  ReverseSearchParams,
  RadiusSearchParams,
  LocationResponse,
  LocationDocument,
} from './locations.types.js';

export class LocationsService {
  private repository: LocationsRepository;

  constructor(repository: LocationsRepository) {
    this.repository = repository;
  }

  async forwardSearch(params: ForwardSearchParams & { state?: string; limit?: number }): Promise<LocationResponse[]> {
    const limit = params.limit ?? 10;
    const results = await this.repository.searchByText(params.zip, params.state, limit);
    return results.map(this.formatLocationResponse);
  }

  async reverseSearch(params: ReverseSearchParams): Promise<LocationResponse | null> {
    const result = await this.repository.findNearest(params.longitude, params.latitude);
    return result ? this.formatLocationResponse(result) : null;
  }

  async radiusSearch(params: RadiusSearchParams & { limit?: number }): Promise<LocationResponse[]> {
    const limit = params.limit ?? 50;
    const results = await this.repository.findWithinRadius(
      params.longitude,
      params.latitude,
      params.radius,
      limit
    );
    return results.map(this.formatLocationResponse);
  }

  private formatLocationResponse(doc: LocationDocument): LocationResponse {
    return {
      zip: doc.zip,
      city: doc.city,
      state: doc.state,
      county: doc.county,
      timezone: doc.timezone,
      population: doc.population,
      longitude: doc.location.coordinates[0],
      latitude: doc.location.coordinates[1],
    };
  }
}
