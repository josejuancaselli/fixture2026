import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

async function loginUsuario(nombre) {

  const nombreNormalizado = nombre
    .trim()
    .toLowerCase()

  const usuarioRef = doc(db, "usuarios", nombreNormalizado)
  const usuarioSnap = await getDoc(usuarioRef)

  if (!usuarioSnap.exists()) {
    const nuevoUsuario = {
      nombre: nombreNormalizado,
      predicciones: [],
      bracket: {
        ganadores16avos: [],
        ganadoresOctavos: [],
        ganadoresCuartos: [],
        ganadoresSemis: [],
        ganadorFinal: [],
      },
    }
    await setDoc(usuarioRef, nuevoUsuario)
    return nuevoUsuario
  }

  const data = usuarioSnap.data()

  // compatibilidad con usuarios viejos que no tienen bracket guardado
  if (!data.bracket) {
    data.bracket = {
      ganadores16avos: [],
      ganadoresOctavos: [],
      ganadoresCuartos: [],
      ganadoresSemis: [],
      ganadorFinal: [],
    }
  }

  return data
}

export default loginUsuario