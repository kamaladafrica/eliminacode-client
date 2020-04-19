import React from 'react'
import TextAttesa from './TextAttesa'
import { minutiToText } from './utils'

type Props = {
  numero: number
  url: string
  fila: number
  tempo: number
  alert: boolean
  expiring: boolean
  tempoRimasto: number
  onAnnulla: () => void
}

const QRCode: React.FC<Props> = ({
  numero,
  url,
  fila,
  tempo,
  alert,
  expiring,
  tempoRimasto,
  onAnnulla,
}) => {
  return (
    <div
      className="card text-center shadow-lg rounded-lg border-0"
      style={{ maxWidth: '300px' }}
    >
      <h1
        className={
          'card-header p-2 font-weight-bold display-4' +
          (alert && ' bg-danger text-white')
        }
      >
        {numero}
      </h1>
      <div className="bg-white">
        <img
          className="card-img-top m-auto my-2"
          style={{ width: 'auto' }}
          src={url}
          alt="qrcode"
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">
          Il tuo numero è il{' '}
          <span id="progressivo" className="font-weight-bold">
            {numero}
          </span>
        </h5>
        <p className="card-text">
          Quando richiesto mostra questo codice al personale
        </p>
        <button className="btn btn-primary" onClick={() => onAnnulla()}>
          Annulla prenotazione
        </button>
      </div>
      {!alert ? (
        <div className="card-footer text-muted">
          Hai ancora {fila} persone davanti
          <br />
          <TextAttesa minuti={tempo} />
        </div>
      ) : (
        <div className="card-footer text-danger font-weight-bold">
          {fila > 0 ? (
            <span>
              Hai solo {fila} {fila > 1 ? 'persone' : 'persona'} davanti,
              affrettati!
            </span>
          ) : (
            <>
              <span>E' il tuo turno, non fare tardi!</span>
              {expiring && (
                <small>
                  <br></br>
                  (la prenotazione scadrà tra circa{' '}
                  {minutiToText(tempoRimasto)})
                </small>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default QRCode
