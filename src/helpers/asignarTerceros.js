function asignarTerceros(
    slots16avos,
    mejoresTerceros
) {

    const slotsTerceros =
        Object.entries(slots16avos)
            .filter(
                ([_, valor]) =>
                    valor.startsWith("3")
            )



    function backtrack(
        index,
        usados,
        asignaciones
    ) {

        /* ========================= */
        /* TERMINAMOS */
        /* ========================= */

        if (
            index === slotsTerceros.length
        ) {

            return asignaciones

        }



        const [
            slot,
            valor
        ] = slotsTerceros[index]



        const gruposPermitidos =
            valor
                .replace("3", "")
                .split("")



        const candidatos =
            mejoresTerceros.filter(
                (equipo) => {

                    return (
                        gruposPermitidos.includes(
                            equipo.grupo
                        ) &&
                        !usados.includes(
                            equipo.id
                        )
                    )

                }
            )



        for (
            const candidato
            of candidatos
        ) {

            const resultado =
                backtrack(

                    index + 1,

                    [
                        ...usados,
                        candidato.id
                    ],

                    {
                        ...asignaciones,

                        [slot]:
                            candidato
                    }

                )



            if (resultado) {

                return resultado

            }

        }



        return null

    }



    return backtrack(
        0,
        [],
        {}
    )

}

export default asignarTerceros