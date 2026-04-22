import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({ error: 'Database error', code: err.code, message: err.message })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Internal server error' })
}
