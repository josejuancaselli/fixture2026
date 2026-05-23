function obtenerClasificados(
    grupos,
    equipos,
    partidos,
    predicciones,
    calcularTabla
) {

    const clasificados = {}

    const terceros = []



    grupos.forEach((grupo) => {

        const equiposGrupo = equipos.filter(
            equipo => equipo.grupo === grupo
        )



        const partidosGrupo = partidos.filter(
            partido => partido.grupo === grupo
        )



        const tablaGrupo = calcularTabla(
            equiposGrupo,
            partidosGrupo,
            predicciones
        )



        clasificados[`${grupo}1`] = tablaGrupo[0]

        clasificados[`${grupo}2`] = tablaGrupo[1]



        terceros.push({

            ...tablaGrupo[2],

            grupo,

        })

    })



    terceros.sort((a, b) => {

        if (b.puntos !== a.puntos) {
            return b.puntos - a.puntos
        }

        if (b.dg !== a.dg) {
            return b.dg - a.dg
        }

        return b.gf - a.gf

    })



    const mejoresTerceros =
        terceros.slice(0, 8)



    return {

        clasificados,

        mejoresTerceros,

    }

}

export default obtenerClasificados