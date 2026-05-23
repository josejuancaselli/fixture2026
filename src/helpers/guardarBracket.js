import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"

async function guardarBracket(usuario, bracket) {
  const usuarioRef = doc(db, "usuarios", usuario)
  await updateDoc(usuarioRef, { bracket })
}

export default guardarBracket