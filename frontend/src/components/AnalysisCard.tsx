import React from 'react'
import { Link } from 'react-router-dom'
import { Analysis } from '../types'

export default function AnalysisCard({ item }: { item: Analysis }) {
  return (
    <Link to={`/analyses/${item.id}`} className="analysis-card">
      <div className="left">
        <div className="domain">{item.domain || item.url}</div>
        <div className="url muted">{item.url}</div>
      </div>
      <div className="right">
        <div className={`status ${item.status || ''}`}>{item.status}</div>
        <div className="time muted">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</div>
      </div>
    </Link>
  )
}
