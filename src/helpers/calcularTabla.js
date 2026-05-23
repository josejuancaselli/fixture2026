function calcularTabla(
    equipos,
    partidos,
    predicciones
) {

    const tabla = equipos.map((equipo) => {

        return {

            ...equipo,

            puntos: 0,

            gf: 0,
            gc: 0,
            dg: 0,

        }
    })



    partidos.forEach((partido) => {

        const prediccion = predicciones.find(
            pred => pred.partidoId === partido.id
        )



        if (
            !prediccion ||
            prediccion.golesLocal === null ||
            prediccion.golesVisitante === null
        ) {
            return
        }



        const equipoLocal = tabla.find(
            equipo => equipo.id === partido.local
        )

        const equipoVisitante = tabla.find(
            equipo => equipo.id === partido.visitante
        )



        equipoLocal.gf += prediccion.golesLocal
        equipoLocal.gc += prediccion.golesVisitante

        equipoVisitante.gf += prediccion.golesVisitante
        equipoVisitante.gc += prediccion.golesLocal



        equipoLocal.dg =
            equipoLocal.gf - equipoLocal.gc

        equipoVisitante.dg =
            equipoVisitante.gf - equipoVisitante.gc



        if (
            prediccion.golesLocal >
            prediccion.golesVisitante
        ) {

            equipoLocal.puntos += 3

        }

        else if (
            prediccion.golesLocal <
            prediccion.golesVisitante
        ) {

            equipoVisitante.puntos += 3

        }

        else {

            equipoLocal.puntos += 1
            equipoVisitante.puntos += 1

        }

    })



    tabla.sort((a, b) => {

        if (b.puntos !== a.puntos) {
            return b.puntos - a.puntos
        }

        if (b.dg !== a.dg) {
            return b.dg - a.dg
        }

        return b.gf - a.gf

    })



    return tabla

}

export default calcularTabla