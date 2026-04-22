import React from 'react'
import { downloadText } from '../utils/download'

export default function MarkdownPanel({ title, text, filename }: { title: string; text?: string | null; filename: string }) {
  return (
    <div className="panel markdown-panel card">
      <div className="panel-header">
        <h3>{title}</h3>
        <div>
          <button className="btn-ghost" onClick={() => downloadText(filename, text || '', 'text/markdown')}>Download MD</button>
        </div>
      </div>
      <div className="md-block">{text ? <pre>{text}</pre> : <div className="muted">No content</div>}</div>
    </div>
  )
}
