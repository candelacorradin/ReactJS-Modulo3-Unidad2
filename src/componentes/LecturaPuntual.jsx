import { useState } from 'react'
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
} from '../servicios/productos'

function LecturaPuntual() {
  const [lista, setLista] = useState(null)
  const [idBuscado, setIdBuscado] = useState('')
  const [encontrado, setEncontrado] = useState(undefined)
  const [error, setError] = useState(null)

  async function leerTodos() {
    setError(null)
    try {
      setLista(await obtenerTodosLosProductos())
    } catch (fallo) {
      setError(fallo.message)
    }
  }

  async function buscarPorId(evento) {
    evento.preventDefault()
    const id = idBuscado.trim()
    if (id === '') return

    setError(null)
    setEncontrado(undefined)
    try {
      setEncontrado(await obtenerProductoPorId(id))
    } catch (fallo) {
      setError(fallo.message)
    }
  }

  return (
    <section className="tarjeta">
      <h2>Lectura puntual</h2>
      <p className="ayuda">
        A diferencia de la lista de arriba, esto lee una sola vez con{' '}
        <code>getDocs</code> y <code>getDoc</code>: devuelve una foto del momento
        y no vuelve a actualizarse.
      </p>

      <button type="button" onClick={leerTodos}>
        Leer la colección completa (getDocs)
      </button>

      {lista && (
        <div className="resultado">
          <p>
            <strong>{lista.length}</strong>{' '}
            {lista.length === 1 ? 'documento' : 'documentos'} en la colección:
          </p>
          <ul>
            {lista.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} — ${producto.precio} — stock {producto.stock}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={buscarPorId}>
        <div className="campo">
          <label htmlFor="idBuscado">Buscar un documento por su ID (getDoc)</label>
          <input
            id="idBuscado"
            type="text"
            value={idBuscado}
            onChange={(evento) => setIdBuscado(evento.target.value)}
            placeholder="producto001"
          />
        </div>
        <button type="submit">Buscar</button>
      </form>

      {encontrado === null && (
        <p className="error">No existe ningún documento con ese ID.</p>
      )}

      {encontrado && (
        <div className="resultado">
          <p>
            <strong>{encontrado.nombre}</strong>
          </p>
          <ul>
            <li>Precio: {encontrado.precio}</li>
            <li>Stock: {encontrado.stock}</li>
            <li>
              ID: <code>{encontrado.id}</code>
            </li>
          </ul>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default LecturaPuntual
