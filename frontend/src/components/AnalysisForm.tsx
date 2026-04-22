import React, { useState } from 'react'
import { createAnalysis } from '../api/analyses'

export default function AnalysisForm({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createAnalysis(url)
      setUrl('')
      onSuccess && onSuccess()
    } catch (err: any) {
      setError(err?.message || 'Error')
    } finally { setLoading(false) }
  }

  return (
    <form className="analysis-form" onSubmit={submit}>
      <input placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
      <button type="submit" disabled={loading || !url}>{loading ? 'Analyzing…' : 'Analyze'}</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}
