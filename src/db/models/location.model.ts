import mongoose, { Schema, Document } from 'mongoose';

interface ILocation extends Document {
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

const locationSchema = new Schema<ILocation>({
  zip: {
    type: String,
    required: true,
    index: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  county: {
    type: String,
  },
  timezone: {
    type: String,
  },
  population: {
    type: Number,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
}, {
  timestamps: true,
});

locationSchema.index({ location: '2dsphere' });
locationSchema.index({ city: 'text', state: 'text' });

export const Location = mongoose.model<ILocation>('Location', locationSchema);
