import React from 'react'
import TextAttesa from './TextAttesa'

type Props = {
  fila: number
  tempo: number
  alert: boolean
  onStacca: () => void
}

const Announce: React.FC<Props> = ({ fila, tempo, alert, onStacca }) => {
  return (
    <div className="jumbotron shadow-lg border-0">
      <h1 className="display-4"> Prenota subito il tuo numero! </h1>
      <h4 className="text-primary">CONAD City Capena</h4>
      <hr className="mt-5 mb-4 border-primacry" />
      <p className="lead">
        Fai comodamente la fila sul tuo divano di casa col nuovo elimina code
        online!
      </p>
      {fila ? (
        tempo > 15 ? (
          <p>
            Adesso hai {fila} {fila === 1 ? 'sola persona' : 'persone'} davanti
            <br />
            {tempo > 15 && <TextAttesa minuti={tempo} />}
          </p>
        ) : (
          <p>
            Hai solamente {fila} {fila === 1 ? 'sola persona' : 'persone'}{' '}
            davanti
          </p>
        )
      ) : (
        <p>Sei il prossimo, prenota il tuo numero e vai!</p>
      )}
      <p className="lead">
        <button className="btn btn-primary btn-lg" onClick={() => onStacca()}>
          Prenota il tuo numero...
        </button>
      </p>
    </div>
  )
}

export default Announce
