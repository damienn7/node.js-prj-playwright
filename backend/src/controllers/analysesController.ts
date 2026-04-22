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

export const getAnalysisScreenshots = async (req: Request, res: Response) => {
  const { id } = req.params
  const screenshots = await service.getAnalysisScreenshots(id)
  if (screenshots === null) return res.status(404).json({ error: 'Analysis not found' })
  res.json({ data: screenshots })
}

export const getAnalysisScreenshotByStepIndex = async (req: Request, res: Response) => {
  const { id } = req.params
  const stepIndexRaw = req.params.stepIndex
  const stepIndex = Number(stepIndexRaw)
  if (!Number.isInteger(stepIndex) || stepIndex < 0) return res.status(400).json({ error: 'Invalid stepIndex' })

  const screenshot = await service.getAnalysisScreenshotByStepIndex(id, stepIndex)
  if (screenshot === null) return res.status(404).json({ error: 'Analysis not found' })
  if (!screenshot) return res.status(404).json({ error: 'Screenshot not found' })
  res.json({ data: screenshot })
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
