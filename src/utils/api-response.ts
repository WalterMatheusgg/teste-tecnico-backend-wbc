export const successResponse = (data: unknown, meta?: unknown) => ({
  success: true,
  data,
  ...(meta ? { meta } : {}),
});

export const errorResponse = (message: string, statusCode: number) => ({
  success: false,
  message,
  statusCode,
});
