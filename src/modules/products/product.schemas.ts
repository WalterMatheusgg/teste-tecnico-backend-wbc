import { z } from 'zod';

export const productIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Product id must be a valid UUID' }),
  }),
});

export const productCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    description: z.string().trim().optional(),
    price: z.coerce.number().gt(0, { message: 'Price must be greater than zero' }),
    stock: z.coerce.number().int().min(0, { message: 'Stock must be greater than or equal to zero' }),
    categoryId: z.string().uuid({ message: 'Category id must be a valid UUID' }),
  }),
});

export const productUpdateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
    description: z.string().trim().optional(),
    price: z.coerce.number().gt(0, { message: 'Price must be greater than zero' }).optional(),
    stock: z.coerce.number().int().min(0, { message: 'Stock must be greater than or equal to zero' }).optional(),
    categoryId: z.string().uuid({ message: 'Category id must be a valid UUID' }).optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: 'Product id must be a valid UUID' }),
  }),
});

export const productListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    categoryId: z.string().uuid().optional(),
    priceMin: z.coerce.number().gt(0).optional(),
    priceMax: z.coerce.number().gt(0).optional(),
    name: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined && data.priceMin > data.priceMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceMin'],
        message: 'priceMin cannot be greater than priceMax',
      });
    }
  }),
});
