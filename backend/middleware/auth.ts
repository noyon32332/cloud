import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email?: string
    role?: string
  }
}

/**
 * Middleware: verify JWT Bearer token.
 * Sets req.user = { id, email, role } on success.
 * Returns 401 if token is missing or invalid.
 */
export function protect(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided. Please log in.' })
    return
  }

  const token = authHeader.slice(7)
  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.error('[Auth] JWT_SECRET is not set in environment variables.')
    res.status(500).json({ message: 'Server configuration error.' })
    return
  }

  try {
    const decoded = jwt.verify(token, secret) as { id: string; email?: string; role?: string }
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token. Please log in again.' })
  }
}
