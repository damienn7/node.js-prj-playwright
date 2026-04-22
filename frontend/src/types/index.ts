export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed'

export type Analysis = {
  id: string
  url: string
  normalizedUrl?: string
  domain?: string
  status?: AnalysisStatus
  createdAt?: string
  updatedAt?: string
}

export type AnalysisScreenshot = {
  stepIndex: number
  label?: string
  filePath?: string
  storage?: string
  s3Key?: string
  url?: string
}

export type ApiListResponse<T> = { data: T[] }
