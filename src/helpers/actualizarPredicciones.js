function actualizarPrediccion(
    prev,
    partidoId,
    campo,
    valor
) {

    const existePrediccion = prev.find(
        pred => pred.partidoId === partidoId
    )



    if (existePrediccion) {

        return prev.map((pred) => {

            if (pred.partidoId === partidoId) {

                return {

                    ...pred,

                    [campo]:
                        valor === ""
                            ? null
                            : Number(valor)

                }

            }

            return pred

        })

    }



    return [

        ...prev,

        {
            partidoId,

            golesLocal:
                campo === "golesLocal"
                    ? valor === ""
                        ? null
                        : Number(valor)
                    : null,

            golesVisitante:
                campo === "golesVisitante"
                    ? valor === ""
                        ? null
                        : Number(valor)
                    : null,
        }

    ]

}

export default actualizarPrediccion