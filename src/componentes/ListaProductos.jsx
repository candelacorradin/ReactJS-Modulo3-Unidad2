import { useEffect, useState } from 'react'
import {
  suscribirseAProductos,
  actualizarCampo,
  actualizarConMerge,
  eliminarProducto,
} from '../servicios/productos'

function ListaProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    const cancelarSuscripcion = suscribirseAProductos(
      (lista) => {
        setProductos(lista)
        setCargando(false)
        setError(null)
      },
      (fallo) => {
        setError(fallo.message)
        setCargando(false)
      },
    )

    return cancelarSuscripcion
  }, [])

  async function ejecutar(accion, textoExito) {
    setAviso(null)
    try {
      await accion()
      setAviso({ tipo: 'ok', texto: textoExito })
    } catch (fallo) {
      setAviso({ tipo: 'error', texto: fallo.message })
    }
  }

  function sumarStock(producto) {
    ejecutar(
      () => actualizarCampo(producto.id, { stock: producto.stock + 1 }),
      `updateDoc: stock de "${producto.nombre}" pasó a ${producto.stock + 1}.`,
    )
  }

  function bajarPrecio(producto) {
    const nuevoPrecio = Math.round(producto.precio * 0.9)
    ejecutar(
      () => actualizarConMerge(producto.id, { precio: nuevoPrecio }),
      `setDoc con merge: precio de "${producto.nombre}" pasó a ${nuevoPrecio}.`,
    )
  }

  function borrar(producto) {
    ejecutar(
      () => eliminarProducto(producto.id),
      `deleteDoc: se eliminó "${producto.nombre}".`,
    )
  }

  return (
    <section className="tarjeta">
      <h2>Productos en tiempo real</h2>
      <p className="ayuda">
        Esta lista está suscripta con <code>onSnapshot</code>: se actualiza sola
        cuando cambia la colección, incluso si el cambio se hace desde la consola
        de Firebase.
      </p>

      {cargando && <p className="ayuda">Cargando…</p>}
      {error && <p className="error">{error}</p>}

      {!cargando && !error && productos.length === 0 && (
        <p className="ayuda">Todavía no hay productos en la colección.</p>
      )}

      {productos.length > 0 && (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>ID</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <code>{producto.id}</code>
                  </td>
                  <td className="acciones">
                    <button type="button" onClick={() => sumarStock(producto)}>
                      Stock +1
                    </button>
                    <button type="button" onClick={() => bajarPrecio(producto)}>
                      Precio −10%
                    </button>
                    <button
                      type="button"
                      className="peligro"
                      onClick={() => borrar(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aviso && <p className={aviso.tipo}>{aviso.texto}</p>}
    </section>
  )
}

export default ListaProductos
