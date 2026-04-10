export interface LocationDocument {
  zip: string;
  city: string;
  state: string;
  county?: string;
  timezone?: string;
  population?: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface ForwardSearchParams {
  zip: string;
}

export interface ReverseSearchParams {
  latitude: number;
  longitude: number;
}

export interface RadiusSearchParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface LocationResponse {
  zip: string;
  city: string;
  state: string;
  county?: string;
  timezone?: string;
  population?: number;
  latitude: number;
  longitude: number;
}
