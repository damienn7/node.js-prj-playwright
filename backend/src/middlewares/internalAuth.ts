import { Request, Response, NextFunction } from 'express'

const SHARED_TOKEN = process.env.WORKER_SHARED_TOKEN || ''

export const internalAuth = (req: Request, res: Response, next: NextFunction) => {
  const h = req.header('authorization') || ''
  if (!h.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = h.slice('Bearer '.length)
  if (!token || token !== SHARED_TOKEN) return res.status(401).json({ error: 'Unauthorized' })
  return next()
}

export default internalAuth
