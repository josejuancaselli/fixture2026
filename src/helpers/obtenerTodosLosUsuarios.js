import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/firebase"

async function obtenerTodosLosUsuarios() {
  const snapshot = await getDocs(collection(db, "usuarios"))
  return snapshot.docs.map(doc => doc.data())
}

export default obtenerTodosLosUsuarios