import React, { useState, useEffect, useRef } from 'react'
import CircuitSelector from '../components/CircuitSelector.jsx'
import DriverCard from '../components/DriverCard.jsx'
import ProbabilityBar from '../components/ProbabilityBar.jsx'
import HeatmapChart from '../components/HeatmapChart.jsx'
import { fetchRace } from '../api/client.js'

function CircuitInfo({ circuit }) {
    if (!circuit) return null
    return (
        <div className="f1-card p-4 flex flex-wrap gap-6">
            <div>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest">GRAN PREMIO</div>
                <div className="font-orbitron font-bold text-white mt-1">{circuit.name}</div>
                <div className="font-rajdhani text-sm text-gray-400">{circuit.city}</div>
            </div>
            <div>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest">TIPO</div>
                <div className={`font-rajdhani font-semibold mt-1 ${circuit.type === 'street' ? 'text-pink-400' : 'text-blue-400'}`}>
                    {circuit.type === 'street' ? '🏙️ Urbano' : '🏟️ Permanente'}
                </div>
            </div>
            <div>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest">TEMP.</div>
                <div className="font-rajdhani font-semibold text-orange-400 mt-1">{circuit.temp}°C</div>
            </div>
            <div>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest">OVERTAKING IDX</div>
                <div className="font-rajdhani font-semibold text-white mt-1">
                    {circuit.overtaking}/10
                    {circuit.overtaking >= 8 && <span className="text-green-400 ml-1">↑ ALTO</span>}
                    {circuit.overtaking <= 3 && <span className="text-red-400 ml-1">↓ BAJO</span>}
                </div>
            </div>
            <div>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest">VUELTAS</div>
                <div className="font-rajdhani font-semibold text-white mt-1">{circuit.laps}</div>
            </div>
        </div>
    )
}

function DriverDetailPanel({ driver, onClose }) {
    const panelRef = useRef(null)

    useEffect(() => {
        if (window.innerWidth <= 768 && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [driver?.code])

    if (!driver) {
        return (
            <div className="f1-card p-6 text-center">
                <div className="font-orbitron text-xs text-gray-600 tracking-widest mb-3">PANEL DE PILOTO</div>
                <div className="font-rajdhani text-gray-500 text-sm">Selecciona un piloto para ver detalles</div>
                <div className="text-4xl mt-4 opacity-20">🏎️</div>
            </div>
        )
    }

    const { code, name, number, team, team_color, rookie, win_pct, podium_pct, avg_points,
        expected_pos, pos_distribution, driver_rating, car_rating } = driver

    return (
        <div ref={panelRef} className="f1-card p-5 sticky top-20 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div
                        className="driver-number-big"
                        style={{ color: team_color }}
                    >
                        {number}
                    </div>
                    <div className="font-orbitron font-bold text-white text-sm mt-1">{code}</div>
                    <div className="font-rajdhani text-gray-400 text-sm">{name}</div>
                    <div className="font-rajdhani text-xs mt-1" style={{ color: team_color }}>{team}</div>
                    {rookie && <div className="badge badge-rookie mt-2">ROOKIE</div>}
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-white text-lg leading-none transition-colors"
                    aria-label="Cerrar panel"
                >
                    ×
                </button>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                    { label: 'WIN %', value: `${win_pct.toFixed(1)}%`, color: team_color },
                    { label: 'PODIO %', value: `${podium_pct.toFixed(1)}%`, color: '#888' },
                    { label: 'POS. MEDIA', value: `P${expected_pos.toFixed(1)}`, color: '#888' },
                    { label: 'PTS PROM.', value: avg_points.toFixed(1), color: '#888' },
                ].map(m => (
                    <div key={m.label} className="rounded-md p-3" style={{ background: '#181818' }}>
                        <div className="font-orbitron text-xs text-gray-600 tracking-widest">{m.label}</div>
                        <div className="font-orbitron font-bold text-base mt-1" style={{ color: m.color }}>
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Probability bars */}
            <div className="mb-5">
                <ProbabilityBar label="Win Probability" value={win_pct} max={100} color={team_color} delay={0} />
                <ProbabilityBar label="Podio (Top 3)" value={podium_pct} max={100} color="#888" delay={100} />
                <ProbabilityBar label="Puntos (Top 10)" value={Math.min(podium_pct * 2.5, 100)} max={100} color="#555" delay={200} />
            </div>

            {/* Position histogram */}
            <HeatmapChart posDistribution={pos_distribution} teamColor={team_color} />

            {/* Ratings */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #1A1A1A' }}>
                <div className="font-orbitron text-xs text-gray-600 tracking-widest mb-3">RATINGS</div>
                <ProbabilityBar label="Rating Piloto" value={driver_rating} max={100} color={team_color} delay={0} unit="" />
                <ProbabilityBar label="Rating Chasis" value={car_rating} max={100} color="#666" delay={100} unit="" />
            </div>
        </div>
    )
}

export default function RaceView({ selectedRound, onRoundChange, selectedDriver, onDriverChange }) {
    const [raceData, setRaceData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!selectedRound) return
        let cancelled = false
        setLoading(true)
        setError(null)
        fetchRace(selectedRound, 8000).then(({ data, error: err }) => {
            if (cancelled) return
            if (err) setError(err)
            else setRaceData(data)
            setLoading(false)
        })
        return () => { cancelled = true }
    }, [selectedRound])

    const selectedDriverData = raceData?.results?.find(d => d.code === selectedDriver) || null

    return (
        <div className="space-y-4">
            {/* Circuit selector */}
            <CircuitSelector selectedRound={selectedRound} onSelect={onRoundChange} />

            {/* Circuit info */}
            <CircuitInfo circuit={raceData?.circuit} />

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Driver list */}
                <div className="lg:col-span-2 f1-card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-orbitron text-xs text-gray-500 tracking-widest">
                            PREDICCIÓN DE CARRERA
                        </div>
                        {loading && (
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                                <span className="font-rajdhani text-xs text-orange-400">SIMULANDO...</span>
                            </div>
                        )}
                        {raceData && (
                            <div className="font-rajdhani text-xs text-gray-600">
                                {raceData.iterations?.toLocaleString()} iter.
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-md p-3 mb-3 text-sm font-rajdhani text-red-400"
                            style={{ background: 'rgba(232,0,45,0.1)', border: '1px solid rgba(232,0,45,0.2)' }}>
                            Error: {error}
                        </div>
                    )}

                    {loading && !raceData && (
                        <div className="space-y-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-md animate-pulse" style={{ background: '#111' }} />
                            ))}
                        </div>
                    )}

                    {raceData?.results && (
                        <div className="space-y-1">
                            {raceData.results.map((driver, i) => (
                                <DriverCard
                                    key={driver.code}
                                    driver={driver}
                                    rank={i + 1}
                                    isSelected={selectedDriver === driver.code}
                                    onClick={() => onDriverChange(driver.code === selectedDriver ? null : driver.code)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Driver detail panel */}
                <div className="lg:col-span-1">
                    <DriverDetailPanel
                        driver={selectedDriverData}
                        onClose={() => onDriverChange(null)}
                    />
                </div>
            </div>
        </div>
    )
}
