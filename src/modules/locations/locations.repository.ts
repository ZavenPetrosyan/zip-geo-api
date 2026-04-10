import { Location } from '../../db/models/location.model.js';
import { LocationDocument } from './locations.types.js';

export class LocationsRepository {
  async searchByText(
    query: string,
    state?: string,
    limit?: number
  ): Promise<LocationDocument[]> {
    const filter: Record<string, unknown> = {
      $text: { $search: query },
    };

    if (state) {
      filter.state = state;
    }

    const queryBuilder = Location.find(filter).lean();

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.exec() as Promise<LocationDocument[]>;
  }

  async findNearest(
    longitude: number,
    latitude: number
  ): Promise<LocationDocument | null> {
    return Location.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
    }).lean() as Promise<LocationDocument | null>;
  }

  async findWithinRadius(
    longitude: number,
    latitude: number,
    radiusKm: number,
    limit?: number
  ): Promise<LocationDocument[]> {
    const radiusInRadians = radiusKm / 6378.1;

    const queryBuilder = Location.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians],
        },
      },
    }).lean();

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.exec() as Promise<LocationDocument[]>;
  }
}
