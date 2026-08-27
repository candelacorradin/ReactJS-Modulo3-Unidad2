import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

export function iniciarSesion() {
  return signInAnonymously(auth)
}

export function cerrarSesion() {
  return signOut(auth)
}

export function observarSesion(alCambiar) {
  return onAuthStateChanged(auth, alCambiar)
}
