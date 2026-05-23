function generarSiguienteFase(
  partidosActuales,
  ganadores,
  nombreFase
) {

  const siguientesPartidos = []



  for (
    let i = 0;
    i < partidosActuales.length;
    i += 2
  ) {

    const partido1 =
      partidosActuales[i]



    const partido2 =
      partidosActuales[i + 1]



    const ganador1 =
      ganadores.find(
        ganador =>
          ganador.partidoId === partido1.id
      )



    const ganador2 =
      ganadores.find(
        ganador =>
          ganador.partidoId === partido2.id
      )



    const equipo1 =
      [
        partido1.local,
        partido1.visitante
      ].find(
        equipo =>
          equipo?.id === ganador1?.ganadorId
      )



    const equipo2 =
      [
        partido2.local,
        partido2.visitante
      ].find(
        equipo =>
          equipo?.id === ganador2?.ganadorId
      )



    siguientesPartidos.push({

      id:
        `${nombreFase}-${i / 2 + 1}`,

      local: equipo1,

      visitante: equipo2,

    })

  }



  return siguientesPartidos

}

export default generarSiguienteFase