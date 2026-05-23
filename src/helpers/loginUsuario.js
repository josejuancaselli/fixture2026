import { doc, getDoc, setDoc } from "firebase/firestore"

import { db } from "../firebase/firebase"

async function loginUsuario(nombre) {

    const nombreNormalizado = nombre
        .trim()
        .toLowerCase()

    const usuarioRef = doc(
        db,
        "usuarios",
        nombreNormalizado
    )

    const usuarioSnap = await getDoc(usuarioRef)

    if (!usuarioSnap.exists()) {

        await setDoc(usuarioRef, {
            nombre: nombreNormalizado,
            predicciones: [],
        })

        return {
            nombre: nombreNormalizado,
            predicciones: [],
        }

    }

    return usuarioSnap.data()

}

export default loginUsuario