import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAnalysis, getScreenshots } from '../api/analyses'
import { Analysis, AnalysisScreenshot } from '../types'
import JsonPanel from '../components/JsonPanel'
import MarkdownPanel from '../components/MarkdownPanel'
import ScreenshotGallery from '../components/ScreenshotGallery'
import { downloadJson, downloadText } from '../utils/download'

export default function AnalysisDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [screenshots, setScreenshots] = useState<AnalysisScreenshot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    void (async () => {
      setLoading(true)
      try {
        const res: any = await getAnalysis(id)
        setAnalysis(res.data)
        const sres: any = await getScreenshots(id)
        setScreenshots(sres.data || [])
      } catch (e) { console.error(e) }
      setLoading(false)
    })()
  }, [id])

  if (!id) return <div className="page">No id</div>

  const downloadAllJson = () => {
    if (!analysis) return
    const aid = analysis.id
    downloadJson(`analysis-${aid}-summary.json`, (analysis as any).summaryJson || {})
    downloadJson(`analysis-${aid}-product-map.json`, (analysis as any).productMapJson || {})
    downloadJson(`analysis-${aid}-screenshots.json`, (analysis as any).screenshotsJson || [])
  }

  const downloadMarkdown = (key: string, filename: string) => {
    if (!analysis) return
    const text = (analysis as any)[key] || ''
    downloadText(filename, text, 'text/markdown')
  }

  const fmt = (d?: string) => d ? new Date(d).toLocaleString() : '—'

  return (
    <div className="page">
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <button className="btn-ghost" onClick={() => nav(-1)}>← Back</button>
          <h1 style={{margin:'8px 0'}}>{analysis?.domain || analysis?.url}</h1>
          <div className="muted">{analysis?.url}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className={`status ${analysis?.status || ''}`}>{analysis?.status}</div>
          <div className="muted">Created: {fmt(analysis?.createdAt)}</div>
          <div className="muted">Duration: {analysis?.durationMs ? `${Math.round((analysis?.durationMs||0)/1000)}s` : '—'}</div>
        </div>
      </div>

      {analysis?.errorMessage && <div className="card" style={{borderLeft:'4px solid rgba(255,100,100,0.6)'}}><strong>Error:</strong> {analysis.errorMessage}</div>}

      <div className="card">
        <h3>Overview</h3>
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          <div style={{flex:'1 1 320px'}}>
            <p><strong>Domain:</strong> {analysis?.domain || '—'}</p>
            <p><strong>URL:</strong> {analysis?.url || '—'}</p>
            <p><strong>Status:</strong> {analysis?.status || '—'}</p>
            <p><strong>Started:</strong> {fmt(analysis?.startedAt)}</p>
            <p><strong>Completed:</strong> {fmt(analysis?.completedAt)}</p>
          </div>
          <div style={{flex:'1 1 320px'}}>
            <p><strong>Created:</strong> {fmt(analysis?.createdAt)}</p>
            <p><strong>Updated:</strong> {fmt(analysis?.updatedAt)}</p>
            <p><strong>Duration ms:</strong> {analysis?.durationMs ?? '—'}</p>
            <div style={{marginTop:8}}>
              <button className="btn-ghost" onClick={downloadAllJson}>Download JSONs</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Generated Markdown</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <MarkdownPanel title="User Stories" text={(analysis as any)?.userStoriesMd} filename={`analysis-${id}-user-stories.md`} />
          <MarkdownPanel title="Flows" text={(analysis as any)?.flowsMd} filename={`analysis-${id}-flows.md`} />
          <MarkdownPanel title="PRD" text={(analysis as any)?.prdMd} filename={`analysis-${id}-prd.md`} />
          <MarkdownPanel title="UX Insights" text={(analysis as any)?.uxInsightsMd} filename={`analysis-${id}-ux-insights.md`} />
        </div>
      </div>

      <div className="card">
        <h3>Screenshots</h3>
        {screenshots.length === 0 ? <div className="muted">No screenshots</div> : <ScreenshotGallery items={screenshots} />}
      </div>

      <div className="card">
        <h3>Raw JSON</h3>
        <JsonPanel title="Summary" data={(analysis as any)?.summaryJson || {}} filename={`analysis-${id}-summary.json`} />
        <JsonPanel title="Product Map" data={(analysis as any)?.productMapJson || {}} filename={`analysis-${id}-product-map.json`} />
      </div>
    </div>
  )
}
