import { useState } from 'react'
import {
  crearProductoIdAutomatico,
  crearProductoConId,
} from '../servicios/productos'

const CAMPOS_VACIOS = { nombre: '', precio: '', stock: '' }

function FormularioProducto() {
  const [campos, setCampos] = useState(CAMPOS_VACIOS)
  const [idManual, setIdManual] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [guardando, setGuardando] = useState(false)

  function alCambiar(evento) {
    const { name, value } = evento.target
    setCampos((previos) => ({ ...previos, [name]: value }))
  }

  function prepararDatos() {
    return {
      nombre: campos.nombre.trim(),
      precio: Number(campos.precio),
      stock: Number(campos.stock),
    }
  }

  function esValido(datos) {
    return (
      datos.nombre !== '' &&
      campos.precio !== '' &&
      campos.stock !== '' &&
      Number.isFinite(datos.precio) &&
      Number.isFinite(datos.stock)
    )
  }

  async function guardar(evento) {
    evento.preventDefault()

    const datos = prepararDatos()
    if (!esValido(datos)) {
      setMensaje({
        tipo: 'error',
        texto: 'Completá nombre, precio y stock con valores válidos.',
      })
      return
    }

    setGuardando(true)
    setMensaje(null)

    try {
      const id = idManual.trim()

      if (id === '') {
        const nuevoId = await crearProductoIdAutomatico(datos)
        setMensaje({
          tipo: 'ok',
          texto: `Creado con addDoc. ID generado por Firestore: ${nuevoId}`,
        })
      } else {
        await crearProductoConId(id, datos)
        setMensaje({ tipo: 'ok', texto: `Creado con setDoc. ID definido: ${id}` })
      }

      setCampos(CAMPOS_VACIOS)
      setIdManual('')
    } catch (error) {
      setMensaje({ tipo: 'error', texto: `No se pudo guardar: ${error.message}` })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="tarjeta">
      <h2>Insertar producto</h2>
      <p className="ayuda">
        Si dejás el ID vacío se usa <code>addDoc</code> y lo genera Firestore.
        Si escribís uno, se usa <code>setDoc</code> con ese identificador.
      </p>

      <form onSubmit={guardar}>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={campos.nombre}
            onChange={alCambiar}
            placeholder="Teclado mecánico"
          />
        </div>

        <div className="fila">
          <div className="campo">
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              name="precio"
              type="number"
              value={campos.precio}
              onChange={alCambiar}
              placeholder="45000"
            />
          </div>

          <div className="campo">
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={campos.stock}
              onChange={alCambiar}
              placeholder="12"
            />
          </div>
        </div>

        <div className="campo">
          <label htmlFor="idManual">ID del documento (opcional)</label>
          <input
            id="idManual"
            type="text"
            value={idManual}
            onChange={(evento) => setIdManual(evento.target.value)}
            placeholder="producto001"
          />
        </div>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar producto'}
        </button>
      </form>

      {mensaje && <p className={mensaje.tipo}>{mensaje.texto}</p>}
    </section>
  )
}

export default FormularioProducto
