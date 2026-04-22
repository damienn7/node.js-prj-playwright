import { Request, Response } from 'express'
import * as service from '../services/analysisService'

export const createAnalysis = async (req: Request, res: Response) => {
  const { url } = req.body
  const analysis = await service.createAnalysis(url)
  res.status(201).json({ data: analysis })
}

export const listAnalyses = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.min(100, Number(req.query.limit || 20))
  const result = await service.listAnalyses({ page, limit })
  res.json(result)
}

export const getAnalysis = async (req: Request, res: Response) => {
  const { id } = req.params
  const found = await service.getAnalysis(id)
  if (!found) return res.status(404).json({ error: 'Analysis not found' })
  res.json({ data: found })
}

export const deleteAnalysis = async (req: Request, res: Response) => {
  const { id } = req.params
  await service.deleteAnalysis(id)
  res.status(204).send()
}

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body
  const updated = await service.updateStatus(id, status)
  res.json({ data: updated })
}
