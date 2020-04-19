import React from 'react'
import Announce from './Announce'
import './App.css'
import QRCode from './QRCode'
import { State, TagState, useTag } from './useTag'
import { isAlert } from './utils'

function App() {
  const [state, tagState, newTag, annullaTag] = useTag()

  const spinner = () => (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  )

  const qrcode = ({
    tempoStimato,
    posizione,
    progressivo,
    qrCodeImageUrl,
  }: TagState) => (
    <QRCode
      tempo={tempoStimato}
      fila={posizione}
      alert={isAlert(posizione, tempoStimato)}
      numero={progressivo}
      url={qrCodeImageUrl}
      expiring={posizione < 0}
      tempoRimasto={tagState.tempoRimasto}
      onAnnulla={() => annullaTag()}
    />
  )

  const announce = ({ posizione, tempoStimato }: State) => (
    <Announce
      fila={posizione}
      tempo={tempoStimato}
      alert={isAlert(posizione, tempoStimato)}
      onStacca={() => newTag()}
    />
  )

  const showSpinner = !state.loaded && !tagState.loaded

  return (
    <div className="app-container h-100 d-flex flex-column align-items-center pt-3">
      {showSpinner && spinner()}
      {state.loaded && !tagState.loaded && announce(state)}
      {tagState.loaded && qrcode(tagState)}
    </div>
  )
}

export default App
