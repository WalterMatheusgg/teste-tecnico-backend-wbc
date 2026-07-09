import type { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../errors/AppError.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      return next(new AppError(message, 400));
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    next();
  };
};
