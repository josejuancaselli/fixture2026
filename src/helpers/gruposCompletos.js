function gruposCompletos(
  partidos,
  predicciones
) {

  return partidos.every((partido) => {

    const prediccion =
      predicciones.find(
        pred =>
          pred.partidoId === partido.id
      )



    return (

      prediccion &&

      prediccion.golesLocal !== null &&

      prediccion.golesVisitante !== null

    )

  })

}

export default gruposCompletos