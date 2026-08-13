import { Request, Response } from 'express'
import { getConnectionStatus } from '../config/database'

export function healthCheck(_req: Request, res: Response): void {
  const dbConnected = getConnectionStatus()

  if (dbConnected) {
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } else {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
}
