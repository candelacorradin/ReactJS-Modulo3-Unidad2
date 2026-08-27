import { useState } from 'react'
import { iniciarSesion, cerrarSesion } from '../servicios/sesion'

function Sesion({ usuario, cargando }) {
  const [error, setError] = useState(null)
  const [ocupado, setOcupado] = useState(false)

  async function alternar() {
    setOcupado(true)
    setError(null)
    try {
      if (usuario) {
        await cerrarSesion()
      } else {
        await iniciarSesion()
      }
    } catch (fallo) {
      setError(fallo.message)
    } finally {
      setOcupado(false)
    }
  }

  if (cargando) {
    return (
      <section className="tarjeta sesion">
        <p className="ayuda">Verificando sesión…</p>
      </section>
    )
  }

  return (
    <section className="tarjeta sesion">
      <div>
        <h2>Sesión</h2>
        <p className={usuario ? 'estado-ok' : 'estado-anonimo'}>
          {usuario
            ? `Autenticada. UID: ${usuario.uid}`
            : 'Sin autenticar. Las escrituras deberían ser rechazadas por las reglas.'}
        </p>
      </div>

      <button type="button" onClick={alternar} disabled={ocupado}>
        {usuario ? 'Cerrar sesión' : 'Iniciar sesión'}
      </button>

      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default Sesion
