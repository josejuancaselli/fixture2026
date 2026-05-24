import Grupo from "./Grupo"
import Bracket from "./Bracket"
import calcularTabla from "../helpers/calcularTabla"
import equipos from "../data/equipos"
import partidos from "../data/partidos"
import obtenerClasificados from "../helpers/obtenerClasificados"
import resolverSlots16avos from "../helpers/resolverSlots16avos"
import slots16avos from "../data/slots16avos"
import generarPartidos16avos from "../helpers/generarPartidos16avos"
import generarSiguienteFase from "../helpers/generarSiguienteFase"

const grupos = ["A","B","C","D","E","F","G","H","I","J","K","L"]

export default function VistaUsuario({ usuarioVisto }) {
  const predicciones = usuarioVisto.predicciones ?? []
  const bracket = usuarioVisto.bracket ?? {}

  const ganadores16avos  = bracket.ganadores16avos  ?? []
  const ganadoresOctavos = bracket.ganadoresOctavos ?? []
  const ganadoresCuartos = bracket.ganadoresCuartos ?? []
  const ganadoresSemis   = bracket.ganadoresSemis   ?? []
  const ganadorFinal     = bracket.ganadorFinal     ?? []

  const { clasificados, mejoresTerceros } = obtenerClasificados(
    grupos, equipos, partidos, predicciones, calcularTabla
  )
  const slotsResueltos  = resolverSlots16avos(slots16avos, clasificados, mejoresTerceros)
  const partidos16avos  = generarPartidos16avos(slotsResueltos)
  const partidosOctavos = generarSiguienteFase(partidos16avos, ganadores16avos, "8")
  const partidosCuartos = generarSiguienteFase(partidosOctavos, ganadoresOctavos, "4")
  const partidosSemis   = generarSiguienteFase(partidosCuartos, ganadoresCuartos, "2")
  const partidosFinal   = generarSiguienteFase(partidosSemis, ganadoresSemis, "1")

  return (
    <>
      <section className="groups-section">
        <div className="groups-grid">
          {grupos.map((grupo) => (
            <Grupo
              key={grupo}
              grupo={grupo}
              equipos={equipos}
              partidos={partidos}
              predicciones={predicciones}
              setPredicciones={null}       // null = solo lectura
              calcularTabla={calcularTabla}
              readOnly
            />
          ))}
        </div>
      </section>

      <section className="knockout-section">
        <h2 className="knockout-main-title">Fase de Eliminación</h2>
        <Bracket
          partidos16avos={partidos16avos}
          partidosOctavos={partidosOctavos}
          partidosCuartos={partidosCuartos}
          partidosSemis={partidosSemis}
          partidosFinal={partidosFinal}
          ganadores16avos={ganadores16avos}
          ganadoresOctavos={ganadoresOctavos}
          ganadoresCuartos={ganadoresCuartos}
          ganadoresSemis={ganadoresSemis}
          ganadorFinal={ganadorFinal}
          readOnly
        />
      </section>
    </>
  )
}