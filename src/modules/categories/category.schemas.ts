import { z } from 'zod';

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Category id must be a valid UUID' }),
  }),
});

export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
  }),
});

export const categoryUpdateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: 'Category id must be a valid UUID' }),
  }),
});

export const categoryListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
