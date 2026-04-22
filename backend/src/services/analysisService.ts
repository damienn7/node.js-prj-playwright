import * as repo from '../repositories/analysisRepository'
import { normalizeUrl, extractDomain } from '../lib/url'
import * as pwService from './playwrightAnalysisService'

type createAnalysisPayload = {
    url: string
    normalizedUrl: string
    domain: string
    status: AnalysisStatusEnum
}

enum AnalysisStatusEnum {
    QUEUED = 'queued',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export const createAnalysis = async (url: string) => {
  const normalized = normalizeUrl(url)
  const domain = extractDomain(normalized)

  const payload: createAnalysisPayload = {
    url,
    normalizedUrl: normalized,
    domain,
    status: AnalysisStatusEnum.QUEUED
  }

  const created = await repo.create(payload as any)

  // fire-and-forget analysis run
  setImmediate(() => {
    void pwService.runAnalysis(String(created.id), created.normalizedUrl)
  })

  return created
}

export const listAnalyses = async ({ page, limit }: { page: number; limit: number }) => {
  const skip = (page - 1) * limit
  const items = await repo.findMany({ skip, take: limit })
  const total = await repo.count()
  return { data: items, meta: { page, limit, total } }
}

export const getAnalysis = async (id: string) => {
  return repo.findById(id)
}

export const deleteAnalysis = async (id: string) => {
  return repo.deleteById(id)
}

export const updateStatus = async (id: string, status: string) => {
  return repo.updateStatus(id, status)
}
