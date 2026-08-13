import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
  statusCode?: number
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${statusCode} - ${message}`)
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}
