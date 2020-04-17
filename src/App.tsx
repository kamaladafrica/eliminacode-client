import React from 'react'
import Announce from './Announce'
import './App.css'
import { env } from './env'
import QRCode from './QRCode'
import { useTag } from './useTag'
import { isAlert, stimaTotale } from './utils'
import { Stats, Tag } from './api'

const qrCodeUrl = (baseUrl: string, key: string) => `${baseUrl}/tags/${key}.png`

function App() {
  const [tag, stats, tagStats, newTag, annullaTag] = useTag()

  const spinner = () => (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  )

  const qrcode = (stats: Stats, tag: Tag) => (
    <QRCode
      tempo={stimaTotale(stats)}
      fila={stats.fila}
      alert={isAlert(stats)}
      numero={tag.progressivo}
      url={qrCodeUrl(env.baseUrl, tag.key)}
      onAnnulla={() => annullaTag()}
    />
  )

  const announce = (stats: Stats) => (
    <Announce
      fila={stats.fila}
      tempo={stimaTotale(stats)}
      alert={isAlert(stats)}
      onStacca={() => newTag()}
    />
  )

  const showSpinner = !stats || (tag && !tagStats)

  return (
    <div className="app-container h-100 d-flex flex-column align-items-center pt-3">
      {showSpinner && spinner()}
      {!tag && stats && announce(stats)}
      {tag && tagStats && qrcode(tagStats, tag)}
    </div>
  )
}

export default App
