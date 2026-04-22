import React, { useEffect, useState } from 'react'
import AnalysisForm from '../components/AnalysisForm'
import AnalysisList from '../components/AnalysisList'
import { listAnalyses } from '../api/analyses'
import { Analysis } from '../types'

export default function Dashboard() {
  const [list, setList] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res: any = await listAnalyses(1, 10)
      setList(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  return (
    <div className="page">
      <header className="page-header">
        <h1>Start New Analysis</h1>
        <p className="muted">Enter a URL and discover product insights automatically.</p>
      </header>

      <section className="card">
        <AnalysisForm onSuccess={load} />
      </section>

      <section className="card">
        <h2>Recent Analyses</h2>
        <AnalysisList items={list} loading={loading} />
      </section>
    </div>
  )
}
