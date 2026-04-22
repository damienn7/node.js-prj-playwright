import React from 'react'
import AnalysisCard from './AnalysisCard'
import { Analysis } from '../types'

export default function AnalysisList({ items, loading }: { items: Analysis[], loading?: boolean }) {
  if (loading) return <div className="muted">Loading…</div>
  if (!items || items.length === 0) return <div className="muted">No analyses yet</div>
  return (
    <div className="analysis-list">
      {items.map(i => <AnalysisCard key={i.id} item={i} />)}
    </div>
  )
}
