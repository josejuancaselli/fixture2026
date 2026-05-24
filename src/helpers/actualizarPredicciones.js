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
    const actualizado = prev.map((pred) => {
        if (pred.partidoId === partidoId) {
            return {
                ...pred,
                [campo]: valor === "" ? null : Number(valor)
            }
        }
        return pred
    })

    // Si ambos goles quedaron null, eliminamos el objeto del array
    return actualizado.filter(
        pred => !(pred.partidoId === partidoId && pred.golesLocal === null && pred.golesVisitante === null)
    )
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