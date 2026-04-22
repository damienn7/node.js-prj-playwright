import { apiFetch } from './client'
import { Analysis, AnalysisScreenshot } from '../types'

export const listAnalyses = async (page = 1, limit = 20): Promise<{ data: Analysis[] }> => {
  return apiFetch(`/api/analyses?page=${page}&limit=${limit}`)
}

export const createAnalysis = async (url: string): Promise<{ data: Analysis }> => {
  return apiFetch('/api/analyses', { method: 'POST', body: JSON.stringify({ url }) })
}

export const getAnalysis = async (id: string): Promise<{ data: Analysis }> => {
  return apiFetch(`/api/analyses/${id}`)
}

export const getScreenshots = async (id: string): Promise<{ data: AnalysisScreenshot[] }> => {
  return apiFetch(`/api/analyses/${id}/screenshots`)
}
