import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../Models/User'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if there's a bearer
  const bearer = req.headers.authorization
  if (!bearer) return res.status(401).json({ error: 'No autorizado' })

  const [, token] = bearer.split(' ')

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (typeof decoded === 'object' && decoded.id) {
      // Verify user
      const user = await User.findById(decoded.id).select('_id name email')
      if (user) return (req.user = user)

      res.status(401).json({ error: 'Token no valido' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Token no valido' })
  }

  next()
}
