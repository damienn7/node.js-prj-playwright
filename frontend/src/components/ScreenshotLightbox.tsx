import React, { useEffect } from 'react'

type Props = {
  items: { url?: string; label?: string }[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ScreenshotLightbox({ items, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const item = items[index]

  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <button className="lightbox-prev" onClick={onPrev}>‹</button>
      <div className="lightbox-content">
        {item?.url ? <img src={item.url} alt={item.label || 'screenshot'} /> : <div className="placeholder large">No public URL</div>}
        <div className="lightbox-caption">{index + 1} / {items.length} {item?.label ? `• ${item.label}` : ''}</div>
      </div>
      <button className="lightbox-next" onClick={onNext}>›</button>
    </div>
  )
}
