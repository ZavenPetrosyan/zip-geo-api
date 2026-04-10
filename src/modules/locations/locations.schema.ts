import { z } from 'zod';

export const forwardSearchSchema = z.object({
  q: z.string().min(1),
  state: z.string().optional(),
  limit: z.coerce.number().positive().optional(),
});

export const reverseSearchSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const radiusSearchSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  km: z.coerce.number().positive(),
  limit: z.coerce.number().positive().optional(),
});
