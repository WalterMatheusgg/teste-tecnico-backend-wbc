import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { errorResponse } from '../utils/api-response.js';

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.statusCode));
  }

  if (err instanceof Error) {
    return res.status(500).json(errorResponse(err.message, 500));
  }

  return res.status(500).json(errorResponse('Unexpected error', 500));
};
