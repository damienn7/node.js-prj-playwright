import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid request', details: parseResult.error.errors })
    }
    next()
  }
}
