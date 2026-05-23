import { doc, updateDoc } from "firebase/firestore"

import { db } from "../firebase/firebase"

async function guardarPredicciones(
    usuario,
    predicciones
) {

    const usuarioRef = doc(
        db,
        "usuarios",
        usuario
    )

    await updateDoc(usuarioRef, {
        predicciones,
    })

}

export default guardarPredicciones