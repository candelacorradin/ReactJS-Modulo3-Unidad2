import {
  collection,
  query,
  orderBy,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const COLECCION = 'productos'

function aObjeto(documento) {
  return { id: documento.id, ...documento.data() }
}

export async function crearProductoIdAutomatico(datos) {
  const referencia = await addDoc(collection(db, COLECCION), datos)
  return referencia.id
}

export async function crearProductoConId(id, datos) {
  await setDoc(doc(db, COLECCION, id), datos)
  return id
}

export async function obtenerTodosLosProductos() {
  const instantanea = await getDocs(collection(db, COLECCION))
  return instantanea.docs.map(aObjeto)
}

export async function obtenerProductoPorId(id) {
  const instantanea = await getDoc(doc(db, COLECCION, id))
  return instantanea.exists() ? aObjeto(instantanea) : null
}

export function suscribirseAProductos(alRecibir, alFallar) {
  const consulta = query(collection(db, COLECCION), orderBy('nombre'))
  return onSnapshot(
    consulta,
    (instantanea) => alRecibir(instantanea.docs.map(aObjeto)),
    alFallar,
  )
}

export async function actualizarConMerge(id, campos) {
  await setDoc(doc(db, COLECCION, id), campos, { merge: true })
}

export async function actualizarCampo(id, campos) {
  await updateDoc(doc(db, COLECCION, id), campos)
}

export async function eliminarProducto(id) {
  await deleteDoc(doc(db, COLECCION, id))
}
