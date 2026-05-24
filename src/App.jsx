import { useEffect, useState } from "react"
import equipos from "./data/equipos"
import partidos from "./data/partidos"
import loginUsuario from "./helpers/loginUsuario"
import guardarPredicciones from "./helpers/guardarPredicciones"
import calcularTabla from "./helpers/calcularTabla"
import Grupo from "./components/Grupo"
import obtenerClasificados from "./helpers/obtenerClasificados"
import resolverSlots16avos from "./helpers/resolverSlots16avos"
import slots16avos from "./data/slots16avos"
import generarPartidos16avos from "./helpers/generarPartidos16avos"
import generarSiguienteFase from "./helpers/generarSiguienteFase"
import Bracket from "./components/Bracket"
import guardarBracket from "./helpers/guardarBracket"
import obtenerTodosLosUsuarios from "./helpers/obtenerTodosLosUsuarios"
import VistaUsuario from "./components/VistaUsuario"
import "./App.css"

function App() {

  const [usuario, setUsuario] = useState(null)
  const [tab, setTab] = useState("mis")
  const [usuarios, setUsuarios] = useState([])
  const [usuarioVisto, setUsuarioVisto] = useState(null)
  const [predicciones, setPredicciones] = useState([])
  const [nombreInput, setNombreInput] = useState("")
  const [ganadores16avos, setGanadores16avos] = useState([])
  const [ganadoresOctavos, setGanadoresOctavos] = useState([])
  const [ganadoresCuartos, setGanadoresCuartos] = useState([])
  const [ganadoresSemis, setGanadoresSemis] = useState([])
  const [ganadorFinal, setGanadorFinal] = useState([])

  const handleLogin = async () => {
    if (!nombreInput.trim()) return
    try {
      const dataUsuario = await loginUsuario(nombreInput)
      setUsuario(dataUsuario.nombre)
      setPredicciones(dataUsuario.predicciones)

      const b = dataUsuario.bracket ?? {}
      setGanadores16avos(b.ganadores16avos ?? [])
      setGanadoresOctavos(b.ganadoresOctavos ?? [])
      setGanadoresCuartos(b.ganadoresCuartos ?? [])
      setGanadoresSemis(b.ganadoresSemis ?? [])
      setGanadorFinal(b.ganadorFinal ?? [])

      const todosLosUsuarios = await obtenerTodosLosUsuarios()
      setUsuarios(todosLosUsuarios)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!usuario) return
    guardarPredicciones(usuario, predicciones)
  }, [predicciones])

  useEffect(() => {
    if (!usuario) return
    guardarBracket(usuario, {
      ganadores16avos,
      ganadoresOctavos,
      ganadoresCuartos,
      ganadoresSemis,
      ganadorFinal,
    })
  }, [ganadores16avos, ganadoresOctavos, ganadoresCuartos, ganadoresSemis, ganadorFinal])

  const grupos = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  const { clasificados, mejoresTerceros } = obtenerClasificados(
    grupos,
    equipos,
    partidos,
    predicciones,
    calcularTabla
  )

  // ── Filtro: solo clasificados de grupos con todos los partidos cargados ──
  //
  // Un grupo está "completo" cuando todos sus partidos tienen golesLocal
  // y golesVisitante cargados en las predicciones. Si le falta aunque sea
  // un partido, ese grupo no aporta clasificados al bracket todavía.
  //
const grupoCompleto = (grupoLetra) => {
    const partidosDelGrupo = partidos.filter(p => p.grupo === grupoLetra)
    return partidosDelGrupo.every(p => {
        const pred = predicciones.find(pred => pred.partidoId === p.id)
        return (
            pred !== undefined &&
            pred.golesLocal !== undefined &&
            pred.golesLocal !== null &&
            pred.golesLocal !== "" &&
            pred.golesVisitante !== undefined &&
            pred.golesVisitante !== null &&
            pred.golesVisitante !== ""
        )
    })
}

  // clasificados es { A1: equipo, A2: equipo, B1: equipo, ... }
  // Filtramos cada clave: si la letra del grupo no está completa, ponemos undefined
  // así resolverSlots16avos recibe undefined en ese slot y el bracket muestra "?"
  const clasificadosFiltrados = Object.fromEntries(
    Object.entries(clasificados).map(([clave, equipo]) => {
      // clave es algo como "A1", "B2" — la letra del grupo es clave[0]
      const grupoLetra = clave[0]
      return [clave, grupoCompleto(grupoLetra) ? equipo : undefined]
    })
  )

  // mejoresTerceros es un array — filtramos los que sean de grupos completos
  const mejoresTercerosFiltrados = mejoresTerceros.filter(
    e => grupoCompleto(e.grupo)
  )

  // Login Screen
  if (!usuario) {
    return (
      <div className="login-container">
        <h1 className="login-title">El Fixture de tu amigo Jota</h1>
        <p className="login-subtitle">Quién sos vos?</p>
        <div className="login-form">
          <input
            type="text"
            value={nombreInput}
            onChange={(e) => setNombreInput(e.target.value)}
            placeholder="Acá pone tu nombre amic"
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Entrar
          </button>
        </div>
      </div>
    )
  }

  // Main App
  //
  // Usamos clasificadosFiltrados y mejoresTercerosFiltrados en lugar de
  // clasificados y mejoresTerceros — así los slots del bracket solo se
  // completan cuando el grupo correspondiente tiene todos sus partidos cargados
  //
  const slotsResueltos = resolverSlots16avos(
    slots16avos,
    clasificadosFiltrados,
    mejoresTercerosFiltrados
  )

  const partidos16avos  = generarPartidos16avos(slotsResueltos)
  const partidosOctavos = generarSiguienteFase(partidos16avos, ganadores16avos, "8")
  const partidosCuartos = generarSiguienteFase(partidosOctavos, ganadoresOctavos, "4")
  const partidosSemis   = generarSiguienteFase(partidosCuartos, ganadoresCuartos, "2")
  const partidosFinal   = generarSiguienteFase(partidosSemis, ganadoresSemis, "1")

  return (
    <div className="app-container">

      <header className="app-header">
        <h1 className="welcome-title">Bienvenido, {usuario}</h1>
        <div className="tabs">
          <button
            className={`tab-btn${tab === "mis" ? " tab-btn--active" : ""}`}
            onClick={() => { setTab("mis"); setUsuarioVisto(null) }}
          >
            Mis predicciones
          </button>
          <button
            className={`tab-btn${tab === "otros" ? " tab-btn--active" : ""}`}
            onClick={() => setTab("otros")}
          >
            Ver otros
          </button>
        </div>
      </header>

      {/* ── Mis predicciones ── */}
      {tab === "mis" && (
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
                  setPredicciones={setPredicciones}
                  calcularTabla={calcularTabla}
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
              setGanadores16avos={setGanadores16avos}
              setGanadoresOctavos={setGanadoresOctavos}
              setGanadoresCuartos={setGanadoresCuartos}
              setGanadoresSemis={setGanadoresSemis}
              setGanadorFinal={setGanadorFinal}
            />
          </section>
        </>
      )}

      {/* ── Ver otros: lista de usuarios ── */}
      {tab === "otros" && !usuarioVisto && (
        <div className="usuarios-lista">
          {usuarios
            .filter(u => u.nombre !== usuario)
            .map(u => (
              <button
                key={u.nombre}
                className="usuario-btn"
                onClick={() => setUsuarioVisto(u)}
              >
                {u.nombre}
              </button>
            ))
          }
        </div>
      )}

      {/* ── Ver otros: predicciones del usuario seleccionado ── */}
      {tab === "otros" && usuarioVisto && (
        <>
          <button
            className="tab-btn"
            onClick={() => setUsuarioVisto(null)}
            style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
          >
            ← Volver
          </button>
          <h2 className="knockout-main-title">{usuarioVisto.nombre}</h2>
          <VistaUsuario usuarioVisto={usuarioVisto} />
        </>
      )}

    </div>
  )
}

export default App