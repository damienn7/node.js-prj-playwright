import React from 'react'

export default function DownloadButton({ onClick, label = 'Download' }: { onClick: () => void; label?: string }) {
  return (
    <button className="btn-download" onClick={onClick}>
      {label}
    </button>
  )
}
