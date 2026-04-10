import { z } from 'zod';

export const forwardSearchSchema = z.object({
  q: z.string().min(1),
  state: z.string().optional(),
  limit: z.string().transform(Number).pipe(z.number().positive()).optional(),
});

export const reverseSearchSchema = z.object({
  lat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
  lng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
});

export const radiusSearchSchema = z.object({
  lat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
  lng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
  km: z.string().transform(Number).pipe(z.number().positive()),
  limit: z.string().transform(Number).pipe(z.number().positive()).optional(),
});
