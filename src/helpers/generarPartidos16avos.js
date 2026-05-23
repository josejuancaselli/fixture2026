function generarPartidos16avos(
  slotsResueltos
) {

  const partidos = []



  const slots =
    Object.entries(slotsResueltos)



  for (
    let i = 0;
    i < slots.length;
    i += 2
  ) {

    const [
      slotLocal,
      equipoLocal
    ] = slots[i]



    const [
      slotVisitante,
      equipoVisitante
    ] = slots[i + 1]



    partidos.push({

      id: `16-${i / 2 + 1}`,

      slotLocal,

      slotVisitante,

      local: equipoLocal,

      visitante: equipoVisitante,

    })

  }



  return partidos

}

export default generarPartidos16avos