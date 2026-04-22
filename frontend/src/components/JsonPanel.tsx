import React from 'react'
import { downloadJson } from '../utils/download'

export default function JsonPanel({ title, data, filename }: { title: string; data: any; filename: string }) {
  return (
    <div className="panel json-panel card">
      <div className="panel-header">
        <h3>{title}</h3>
        <div>
          <button className="btn-ghost" onClick={() => downloadJson(filename, data)}>Download JSON</button>
        </div>
      </div>
      <pre className="json-block">{JSON.stringify(data || {}, null, 2)}</pre>
    </div>
  )
}
