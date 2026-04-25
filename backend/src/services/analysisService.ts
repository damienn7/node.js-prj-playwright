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

  // optionally run Playwright locally (controlled by env)
  const enabled = String(process.env.PLAYWRIGHT_ENABLED || 'false') === 'true'
  if (enabled) {
    // fire-and-forget analysis run (for local/dev only)
    setImmediate(() => {
      void pwService.runAnalysis(String(created.id), created.normalizedUrl)
    })
  }

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

export type AnalysisScreenshot = {
  stepIndex: number
  label?: string
  filePath?: string
  storage?: string
  s3Key?: string
  url?: string
}

export const getAnalysisScreenshots = async (id: string): Promise<AnalysisScreenshot[] | null> => {
  const row = await repo.findScreenshotsById(id)
  if (!row) return null
  return (row.screenshotsJson || []) as AnalysisScreenshot[]
}

export const getAnalysisScreenshotByStepIndex = async (id: string, stepIndex: number): Promise<AnalysisScreenshot | null> => {
  const screenshots = await getAnalysisScreenshots(id)
  if (!screenshots) return null
  const found = screenshots.find(s => Number(s.stepIndex) === Number(stepIndex))
  return found || null
}

export const deleteAnalysis = async (id: string) => {
  return repo.deleteById(id)
}

export const updateStatus = async (id: string, status: string) => {
  return repo.updateStatus(id, status)
}
