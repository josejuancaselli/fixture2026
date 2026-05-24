import { useState } from "react"
import actualizarPrediccion from "../helpers/actualizarPredicciones"

const Grupo = ({
    grupo,
    equipos,
    partidos,
    predicciones,
    setPredicciones,
    calcularTabla,
    readOnly
}) => {

    const [mostrarPartidos, setMostrarPartidos] = useState(false)

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

    return (
        <div className="grupo-card">
            <div className="grupo-header">
                <h2 className="grupo-titulo">Grupo {grupo}</h2>
            </div>

            <div className="grupo-body">
                {tablaGrupo.map((equipo, index) => (
                    <div
                        key={equipo.id}
                        className={
                            "tabla-row" +
                            (index < 2 ? " tabla-row--clasificado" : "") +
                            (index === 2 ? " tabla-row--tercero" : "")
                        }
                    >
                        <span className="tabla-pos">{index + 1}</span>
                        <img src={equipo.bandera} className="bandera" alt={equipo.nombre} />
                        <span className="tabla-nombre">{equipo.nombre}</span>
                        <span className="tabla-stat">{equipo.gf}</span>
                        <span className="tabla-stat">{equipo.gc}</span>
                        <span className="tabla-stat">{equipo.dg}</span>
                        <span className="tabla-pts">{equipo.puntos}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setMostrarPartidos(!mostrarPartidos)}
                className={`partidos-toggle${mostrarPartidos ? " partidos-toggle--open" : ""}`}
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 4l4 4 4-4" />
                </svg>
                {mostrarPartidos ? "Ocultar partidos" : "Ver partidos"}
            </button>

            {mostrarPartidos && (
                <div className="partidos-list">
                    {partidosGrupo.map((partido) => {
                        const equipoLocal = equipos.find(
                            equipo => equipo.id === partido.local
                        )
                        const equipoVisitante = equipos.find(
                            equipo => equipo.id === partido.visitante
                        )
                        const prediccion = predicciones.find(
                            pred => pred.partidoId === partido.id
                        )
                        return (
                            <div key={partido.id} className="partido-grupo">
                                <span className="partido-equipo-nombre partido-equipo-nombre--local">
                                    {equipoLocal.nombre}
                                </span>

                                <div className="partido-marcador">
                                    <input
                                        type="number"
                                        min="0"
                                        value={prediccion?.golesLocal ?? ""}
                                        readOnly={readOnly}
                                        onChange={(e) => {
                                            if (readOnly) return
                                            setPredicciones((prev) =>
                                                actualizarPrediccion(prev, partido.id, "golesLocal", e.target.value)
                                            )
                                        }}
                                        style={readOnly ? { pointerEvents: "none", opacity: 0.6 } : {}}
                                    />
                                    <span className="partido-separador">–</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={prediccion?.golesVisitante ?? ""}
                                        readOnly={readOnly}
                                        onChange={(e) => {
                                            if (readOnly) return
                                            setPredicciones((prev) =>
                                                actualizarPrediccion(prev, partido.id, "golesVisitante", e.target.value)
                                            )
                                        }}
                                        style={readOnly ? { pointerEvents: "none", opacity: 0.6 } : {}}
                                    />
                                </div>

                                <span className="partido-equipo-nombre partido-equipo-nombre--visitante">
                                    {equipoVisitante.nombre}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Grupo