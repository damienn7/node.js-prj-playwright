import * as repo from '../repositories/analysisRepository'

export const claim = async () => {
  const claimed = await repo.claimQueuedAnalysis()
  return claimed
}

export const complete = async (id: string, payload: any) => {
  const existing = await repo.findById(id)
  if (!existing) return null

  const completedAt = new Date()
  let durationMs: number | undefined = undefined
  if (existing.startedAt) {
    durationMs = completedAt.getTime() - new Date(existing.startedAt).getTime()
  }

  const data: any = {
    status: 'completed',
    completedAt,
    durationMs,
    summaryJson: payload.summaryJson || undefined,
    productMapJson: payload.productMapJson || undefined,
    flowsJson: payload.flowsJson || undefined,
    apiMapJson: payload.apiMapJson || undefined,
    uxInsightsJson: payload.uxInsightsJson || undefined,
    userStoriesMd: payload.userStoriesMd || undefined,
    flowsMd: payload.flowsMd || undefined,
    prdMd: payload.prdMd || undefined,
    uxInsightsMd: payload.uxInsightsMd || undefined,
    screenshotsJson: payload.screenshotsJson || undefined
  }

  return repo.updateById(id, data)
}

export const fail = async (id: string, errorMessage: string) => {
  const existing = await repo.findById(id)
  if (!existing) return null
  const completedAt = new Date()
  let durationMs: number | undefined = undefined
  if (existing.startedAt) {
    durationMs = completedAt.getTime() - new Date(existing.startedAt).getTime()
  }

  return repo.updateById(id, { status: 'failed', errorMessage, completedAt, durationMs })
}
