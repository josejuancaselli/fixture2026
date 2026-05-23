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
import gruposCompletos from "./helpers/gruposCompletos"
import actualizarPrediccion from "./helpers/actualizarPredicciones"
import generarPartidos16avos from "./helpers/generarPartidos16avos"
import generarSiguienteFase from "./helpers/generarSiguienteFase"
import Bracket from "./components/Bracket"
import "./App.css"

function App() {

  const [usuario, setUsuario] = useState(null)
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
    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!usuario) return
    guardarPredicciones(
      usuario,
      predicciones
    )
  }, [predicciones])

  const grupos = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"
  ]

  const { clasificados, mejoresTerceros } = obtenerClasificados(
    grupos,
    equipos,
    partidos,
    predicciones,
    calcularTabla
  )

  const torneoCompleto = gruposCompletos(partidos, predicciones)

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
          <button 
            onClick={handleLogin} 
            className="login-button"
          >
            Entrar
          </button>
        </div>
      </div>
    )
  }

  // Main App
  const slotsResueltos = resolverSlots16avos(
    slots16avos,
    clasificados,
    mejoresTerceros
  )

  const partidos16avos = generarPartidos16avos(slotsResueltos)
  const partidosOctavos = generarSiguienteFase(partidos16avos, ganadores16avos, "8")
  const partidosCuartos = generarSiguienteFase(partidosOctavos, ganadoresOctavos, "4")
  const partidosSemis = generarSiguienteFase(partidosCuartos, ganadoresCuartos, "2")
  const partidosFinal = generarSiguienteFase(partidosSemis, ganadoresSemis, "1")

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="welcome-title">Bienvenido, {usuario}</h1>
      </header>

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

      {torneoCompleto && (
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
)}
    </div>
  )
}

export default App