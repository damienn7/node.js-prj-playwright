import { Request, Response } from 'express'
import * as service from '../services/internalAnalysisService'

export const claimAnalysis = async (req: Request, res: Response) => {
  const claimed = await service.claim()
  if (!claimed) return res.json({ data: null })
  return res.json({ data: claimed })
}

export const completeAnalysis = async (req: Request, res: Response) => {
  const { id } = req.params
  const payload = req.body || {}
  const updated = await service.complete(id, payload)
  if (!updated) return res.status(404).json({ error: 'Analysis not found' })
  return res.json({ data: updated })
}

export const failAnalysis = async (req: Request, res: Response) => {
  const { id } = req.params
  const { errorMessage } = req.body || {}
  if (!errorMessage) return res.status(400).json({ error: 'errorMessage required' })
  const updated = await service.fail(id, errorMessage)
  if (!updated) return res.status(404).json({ error: 'Analysis not found' })
  return res.json({ data: updated })
}
