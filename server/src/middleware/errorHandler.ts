import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode =
    typeof (err as { statusCode?: unknown }).statusCode === "number"
      ? ((err as { statusCode: number }).statusCode as number)
      : 500;

  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: message,
  });
};

