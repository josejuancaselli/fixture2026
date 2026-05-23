import asignarTerceros from "./asignarTerceros"

function resolverSlots16avos(
    slots16avos,
    clasificados,
    mejoresTerceros
) {

    const resultado = {}

    const tercerosAsignados = asignarTerceros(slots16avos, mejoresTerceros)

    Object.entries(slots16avos).forEach(([slot, valor]) => {

        /* ========================= */
        /* PRIMEROS Y SEGUNDOS */
        /* ========================= */

        if (valor.includes("1") || valor.includes("2")) {
            resultado[slot] = clasificados[valor]
        }



        /* ========================= */
        /* TERCEROS */
        /* ========================= */

        if (valor.startsWith("3")) {
            resultado[slot] = tercerosAsignados[slot]
        }

    }
    )



    return resultado

}

export default resolverSlots16avos