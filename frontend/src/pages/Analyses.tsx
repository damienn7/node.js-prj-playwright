import React, { useEffect, useState } from 'react'
import AnalysisList from '../components/AnalysisList'
import { listAnalyses } from '../api/analyses'
import { Analysis } from '../types'

export default function Analyses() {
  const [items, setItems] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { void (async () => {
    setLoading(true)
    try {
      const res: any = await listAnalyses(1, 50)
      setItems(res.data || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  })() }, [])

  return (
    <div className="page">
      <h1>Analyses</h1>
      <div className="card">
        <AnalysisList items={items} loading={loading} />
      </div>
    </div>
  )
}
