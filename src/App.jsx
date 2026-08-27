import { useEffect, useState } from 'react'
import Sesion from './componentes/Sesion'
import FormularioProducto from './componentes/FormularioProducto'
import ListaProductos from './componentes/ListaProductos'
import LecturaPuntual from './componentes/LecturaPuntual'
import { observarSesion } from './servicios/sesion'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [cargandoSesion, setCargandoSesion] = useState(true)

  useEffect(() => {
    return observarSesion((cuenta) => {
      setUsuario(cuenta)
      setCargandoSesion(false)
    })
  }, [])

  return (
    <main>
      <header>
        <h1>Unidad 2 — CRUD en Firestore</h1>
        <p>
          Operaciones de creación, lectura, actualización y eliminación sobre la
          colección <code>productos</code>.
        </p>
      </header>

      <Sesion usuario={usuario} cargando={cargandoSesion} />
      <FormularioProducto />
      <ListaProductos />
      <LecturaPuntual />
    </main>
  )
}

export default App
