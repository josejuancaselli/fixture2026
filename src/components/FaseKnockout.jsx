function FaseKnockout({ titulo, partidos, ganadores, setGanadores }) {

    return (
        <div className="fase-knockout-wrapper">
            <h2 className="fase-knockout-titulo">{titulo}</h2>

            <div className="fase-knockout-grid">
                {partidos.map((partido) => {
                    const ganadorActual = ganadores.find(
                        ganador => ganador.partidoId === partido.id
                    )

                    return (
                        <div key={partido.id} className="partido-knockout">

                            <div
                                className={
                                    ganadorActual?.ganadorId === partido.local?.id
                                        ? "equipo-knockout activo"
                                        : "equipo-knockout"
                                }
                                onClick={() => {
                                    setGanadores((prev) => {
                                        const existe = prev.find(
                                            ganador => ganador.partidoId === partido.id
                                        )
                                        if (existe) {
                                            return prev.map((ganador) => {
                                                if (ganador.partidoId === partido.id) {
                                                    return { ...ganador, ganadorId: partido.local.id }
                                                }
                                                return ganador
                                            })
                                        }
                                        return [...prev, { partidoId: partido.id, ganadorId: partido.local.id }]
                                    })
                                }}
                            >
                                <img
                                    src={partido.local?.bandera}
                                    className="bandera"
                                    alt={partido.local?.nombre}
                                />
                                {partido.local?.nombre}
                            </div>

                            <div
                                className={
                                    ganadorActual?.ganadorId === partido.visitante?.id
                                        ? "equipo-knockout activo"
                                        : "equipo-knockout"
                                }
                                onClick={() => {
                                    setGanadores((prev) => {
                                        const existe = prev.find(
                                            ganador => ganador.partidoId === partido.id
                                        )
                                        if (existe) {
                                            return prev.map((ganador) => {
                                                if (ganador.partidoId === partido.id) {
                                                    return { ...ganador, ganadorId: partido.visitante.id }
                                                }
                                                return ganador
                                            })
                                        }
                                        return [...prev, { partidoId: partido.id, ganadorId: partido.visitante.id }]
                                    })
                                }}
                            >
                                <img
                                    src={partido.visitante?.bandera}
                                    className="bandera"
                                    alt={partido.visitante?.nombre}
                                />
                                {partido.visitante?.nombre}
                            </div>

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FaseKnockout