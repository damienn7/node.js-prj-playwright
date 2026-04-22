import React, { useState } from 'react'
import ScreenshotLightbox from './ScreenshotLightbox'
import { downloadText } from '../utils/download'

export default function ScreenshotGallery({ items }: { items: { url?: string; label?: string; stepIndex?: number; filePath?: string }[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex(i => (i === null ? null : (i - 1 + items.length) % items.length))
  const next = () => setLightboxIndex(i => (i === null ? null : (i + 1) % items.length))

  const download = (item: any) => {
    const name = `screenshot-${item.stepIndex ?? '0'}-${(item.label || 'shot').replace(/[^a-z0-9.-]/gi, '-')}.png`
    if (item.url) {
      // trigger browser download by opening link
      const a = document.createElement('a')
      a.href = item.url
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
    } else {
      downloadText(name, item.filePath || '', 'text/plain')
    }
  }

  return (
    <div className="screenshot-gallery">
      <div className="thumbnails">
        {items.map((it, idx) => (
          <div key={idx} className="thumb card" onClick={() => open(idx)}>
            <div className="thumb-img">{it.url ? <img src={it.url} alt={it.label || String(it.stepIndex)} /> : <div className="placeholder">No URL</div>}</div>
            <div className="thumb-meta">
              <div className="label">{it.label || `step ${it.stepIndex}`}</div>
              <div className="actions">
                <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); download(it) }}>Download</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ScreenshotLightbox
          items={items}
          index={lightboxIndex}
          onClose={close}
          onPrev={() => { prev(); }}
          onNext={() => { next(); }}
        />
      )}
    </div>
  )
}
