import { useRef, useEffect, useState } from "react"

function toggleGanador(setGanadores, partido, equipoId) {
  setGanadores(prev => {
    const existe = prev.find(g => g.partidoId === partido.id)
    if (existe) {
      return prev.map(g =>
        g.partidoId === partido.id ? { ...g, ganadorId: equipoId } : g
      )
    }
    return [...prev, { partidoId: partido.id, ganadorId: equipoId }]
  })
}

/* ── Card ───────────────────────────────────────── */
function MatchCard({ partido, ganadores, setGanadores, mirrored }) {
  if (!partido) return <div className="bk-card bk-card--empty" />

  // Leer ganador directamente del array en cada render
  const ganActual = ganadores.find(g => g.partidoId === partido.id)

  const equipos = [
    { equipo: partido.local,     key: "local"     },
    { equipo: partido.visitante, key: "visitante" },
  ]

  return (
    <div className={`bk-card${mirrored ? " bk-card--mirrored" : ""}`}>
      {equipos.map(({ equipo, key }) => {
        const activo = !!equipo && ganActual?.ganadorId === equipo.id
        return (
          <div
            key={key}
            className={`bk-team${activo ? " bk-team--activo" : ""}${!equipo ? " bk-team--vacio" : ""}`}
            onClick={() => equipo && setGanadores && toggleGanador(setGanadores, partido, equipo.id)}
          >
            {equipo
              ? <img src={equipo.bandera} className="bk-bandera" alt={equipo.nombre} />
              : <span className="bk-placeholder">?</span>
            }
          </div>
        )
      })}
    </div>
  )
}

/* ── Slot ───────────────────────────────────────── */
function Slot({ partido, ganadores, setGanadores, mirrored, flex, slotRef }) {
  return (
    <div ref={slotRef} className="bk-slot" style={{ flex }}>
      <div className="bk-slot-inner">
        <MatchCard
          partido={partido}
          ganadores={ganadores}
          setGanadores={setGanadores}
          mirrored={mirrored}
        />
      </div>
    </div>
  )
}

/* ── Columna ────────────────────────────────────── */
function Col({ partidos, ganadores, setGanadores, mirrored, totalSlots, label, slotRefs }) {
  const slotsPerMatch = totalSlots / (partidos.length || 1)
  return (
    <div className="bk-col">
      <span className="bk-col-label">{label}</span>
      <div className="bk-col-inner">
        {partidos.map((partido, i) => (
          <Slot
            key={partido?.id ?? i}
            partido={partido}
            ganadores={ganadores}
            setGanadores={setGanadores}
            mirrored={mirrored}
            flex={slotsPerMatch}
            slotRef={slotRefs?.[i]}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Final ──────────────────────────────────────── */
function ColFinal({ partido, ganadores, setGanadores, slotRef }) {
  return (
    <div className="bk-col bk-col--final">
      <span className="bk-col-label bk-col-label--final">Final</span>
      <div className="bk-col-inner bk-col-inner--final">
        <div ref={slotRef} className="bk-slot" style={{ flex: 1 }}>
          <div className="bk-slot-inner">
            <MatchCard
              partido={partido}
              ganadores={ganadores}
              setGanadores={setGanadores}
              mirrored={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── SVG Lines — solo geometría, sin estado ─────── */
function Lines({ fromRefs, toRefs, containerRef, side }) {
  const [paths, setPaths] = useState([])

  useEffect(() => {
    if (!containerRef.current) return

    function compute() {
      const containerRect = containerRef.current.getBoundingClientRect()
      const newPaths = []

      for (let t = 0; t < toRefs.length; t++) {
        const toEl = toRefs[t]?.current
        if (!toEl) continue
        const toRect = toEl.getBoundingClientRect()
        const toY = toRect.top + toRect.height / 2 - containerRect.top

        const f1 = fromRefs[t * 2]?.current
        const f2 = fromRefs[t * 2 + 1]?.current
        if (!f1 || !f2) continue

        const f1Rect = f1.getBoundingClientRect()
        const f2Rect = f2.getBoundingClientRect()
        const f1Y = f1Rect.top + f1Rect.height / 2 - containerRect.top
        const f2Y = f2Rect.top + f2Rect.height / 2 - containerRect.top

        if (side === "left") {
          const fromX = f1Rect.right - containerRect.left
          const toX   = toRect.left  - containerRect.left
          const midX  = (fromX + toX) / 2
          newPaths.push(`M ${fromX} ${f1Y} H ${midX} V ${f2Y} M ${fromX} ${f2Y} H ${midX} V ${toY} H ${toX}`)
        } else {
          const fromX = f1Rect.left - containerRect.left
          const toX   = toRect.right - containerRect.left
          const midX  = (fromX + toX) / 2
          newPaths.push(`M ${fromX} ${f1Y} H ${midX} V ${f2Y} M ${fromX} ${f2Y} H ${midX} V ${toY} H ${toX}`)
        }
      }

      setPaths(newPaths)
    }

    // Pequeño delay para que el layout esté pintado
    const id = setTimeout(compute, 50)
    window.addEventListener("resize", compute)
    return () => {
      clearTimeout(id)
      window.removeEventListener("resize", compute)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])   // ← solo al montar; las líneas son pura geometría, no dependen de ganadores

  if (!paths.length) return null

  return (
    <svg className="bk-lines-svg">
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="1" />
      ))}
    </svg>
  )
}

/* ── Principal ──────────────────────────────────── */
export default function Bracket(props) {
  const {
    partidos16avos = [], partidosOctavos = [], partidosCuartos = [],
    partidosSemis = [], partidosFinal = [],
    ganadores16avos = [], ganadoresOctavos = [], ganadoresCuartos = [],
    ganadoresSemis = [], ganadorFinal = [],
    setGanadores16avos, setGanadoresOctavos, setGanadoresCuartos,
    setGanadoresSemis, setGanadorFinal,
  } = props

  const split = (arr) => {
    const mid = Math.ceil(arr.length / 2)
    return [arr.slice(0, mid), arr.slice(mid)]
  }

  const [avos_L, avos_R]  = split(partidos16avos)
  const [oct_L,  oct_R]   = split(partidosOctavos)
  const [cuar_L, cuar_R]  = split(partidosCuartos)
  const [semi_L, semi_R]  = split(partidosSemis)
  const finalPartido       = partidosFinal[0] ?? null

  const SLOTS = 8
  const containerRef = useRef(null)

  const makeRefs = (count) => Array.from({ length: count }, () => useRef(null))

  const refsAvosL = makeRefs(avos_L.length)
  const refsOctL  = makeRefs(oct_L.length)
  const refsCuarL = makeRefs(cuar_L.length)
  const refsSemiL = makeRefs(semi_L.length)
  const refsFinal = [useRef(null)]

  const refsAvosR = makeRefs(avos_R.length)
  const refsOctR  = makeRefs(oct_R.length)
  const refsCuarR = makeRefs(cuar_R.length)
  const refsSemiR = makeRefs(semi_R.length)

  return (
    <div className="bk-root" ref={containerRef}>

      <Col partidos={avos_L}  ganadores={ganadores16avos}  setGanadores={setGanadores16avos}  mirrored={false} totalSlots={SLOTS} label="16avos" slotRefs={refsAvosL} />
      <Col partidos={oct_L}   ganadores={ganadoresOctavos} setGanadores={setGanadoresOctavos} mirrored={false} totalSlots={SLOTS} label="Oct"    slotRefs={refsOctL}  />
      <Col partidos={cuar_L}  ganadores={ganadoresCuartos} setGanadores={setGanadoresCuartos} mirrored={false} totalSlots={SLOTS} label="Cuar"   slotRefs={refsCuarL} />
      <Col partidos={semi_L}  ganadores={ganadoresSemis}   setGanadores={setGanadoresSemis}   mirrored={false} totalSlots={SLOTS} label="Semi"   slotRefs={refsSemiL} />

      <ColFinal partido={finalPartido} ganadores={ganadorFinal} setGanadores={setGanadorFinal} slotRef={refsFinal[0]} />

      <Col partidos={semi_R}  ganadores={ganadoresSemis}   setGanadores={setGanadoresSemis}   mirrored={true} totalSlots={SLOTS} label="Semi"   slotRefs={refsSemiR}  />
      <Col partidos={cuar_R}  ganadores={ganadoresCuartos} setGanadores={setGanadoresCuartos} mirrored={true} totalSlots={SLOTS} label="Cuar"   slotRefs={refsCuarR}  />
      <Col partidos={oct_R}   ganadores={ganadoresOctavos} setGanadores={setGanadoresOctavos} mirrored={true} totalSlots={SLOTS} label="Oct"    slotRefs={refsOctR}   />
      <Col partidos={avos_R}  ganadores={ganadores16avos}  setGanadores={setGanadores16avos}  mirrored={true} totalSlots={SLOTS} label="16avos" slotRefs={refsAvosR}  />

      <Lines fromRefs={refsAvosL} toRefs={refsOctL}  containerRef={containerRef} side="left" />
      <Lines fromRefs={refsOctL}  toRefs={refsCuarL} containerRef={containerRef} side="left" />
      <Lines fromRefs={refsCuarL} toRefs={refsSemiL} containerRef={containerRef} side="left" />
      <Lines fromRefs={refsSemiL} toRefs={refsFinal} containerRef={containerRef} side="left" />

      <Lines fromRefs={refsAvosR} toRefs={refsOctR}  containerRef={containerRef} side="right" />
      <Lines fromRefs={refsOctR}  toRefs={refsCuarR} containerRef={containerRef} side="right" />
      <Lines fromRefs={refsCuarR} toRefs={refsSemiR} containerRef={containerRef} side="right" />
      <Lines fromRefs={refsSemiR} toRefs={refsFinal} containerRef={containerRef} side="right" />

    </div>
  )
}