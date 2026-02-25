import React, { useState, useEffect, useCallback } from 'react'
import ChampionshipTable from '../components/ChampionshipTable.jsx'
import { fetchChampionship } from '../api/client.js'

function PodiumBlock({ driver, position }) {
    if (!driver) return null
    const heights = { 1: 'h-40', 2: 'h-28', 3: 'h-20' }
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
    const golds = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' }
    const h = heights[position]
    const medal = medals[position]
    const bg = golds[position]

    return (
        <div className="flex flex-col items-center gap-2">
            {/* driver info above */}
            <div className="text-center">
                <div className="text-2xl mb-1">{medal}</div>
                <div
                    className="font-orbitron font-bold text-lg"
                    style={{ color: driver.team_color }}
                >
                    {driver.number}
                </div>
                <div className="font-rajdhani font-semibold text-white text-sm">{driver.code}</div>
                <div className="font-rajdhani text-xs text-gray-400">{driver.team}</div>
                <div className="font-orbitron font-bold text-sm mt-1" style={{ color: driver.team_color }}>
                    {driver.projected_pts.toFixed(0)} pts
                </div>
            </div>
            {/* podium block */}
            <div
                className={`podium-block w-28 md:w-36 ${h}`}
                style={{
                    background: `linear-gradient(180deg, ${bg}22, ${bg}11)`,
                    border: `1px solid ${bg}44`,
                }}
            >
                <div
                    className="font-orbitron font-black text-4xl opacity-20"
                    style={{ color: bg }}
                >
                    P{position}
                </div>
            </div>
        </div>
    )
}

export default function ChampionshipView() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        const { data: d, error: e } = await fetchChampionship(500)
        if (e) setError(e)
        else setData(d)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const standings = data?.standings || []
    const constructors = data?.constructors || []

    const p2 = standings[1]
    const p1 = standings[0]
    const p3 = standings[2]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-orbitron font-bold text-white text-lg">CAMPEONATO 2026</div>
                    <div className="font-rajdhani text-gray-500 text-sm">24 GPs · {data?.iterations_per_race || 500} iteraciones/carrera</div>
                </div>
                <button
                    onClick={load}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-orbitron text-xs font-bold tracking-wide transition-all"
                    style={{
                        background: loading ? '#1A1A1A' : 'linear-gradient(135deg, rgba(232,0,45,0.2), rgba(255,128,0,0.2))',
                        border: `1px solid ${loading ? '#2A2A2A' : 'rgba(255,128,0,0.4)'}`,
                        color: loading ? '#555' : '#FF8000',
                    }}
                >
                    {loading ? (
                        <>
                            <div className="w-3 h-3 rounded-full border border-orange-400 border-t-transparent animate-spin" />
                            SIMULANDO
                        </>
                    ) : (
                        '↺ RE-SIMULAR'
                    )}
                </button>
            </div>

            {error && (
                <div className="rounded-md p-3 text-sm font-rajdhani text-red-400"
                    style={{ background: 'rgba(232,0,45,0.1)', border: '1px solid rgba(232,0,45,0.2)' }}>
                    Error: {error}
                </div>
            )}

            {loading && !data && (
                <div className="text-center py-16">
                    <div className="w-10 h-10 rounded-full border-2 border-orange-400 border-t-transparent animate-spin mx-auto mb-4" />
                    <div className="font-rajdhani text-gray-500">Simulando 24 GPs...</div>
                </div>
            )}

            {p1 && (
                <>
                    {/* Podium visual */}
                    <div className="f1-card p-6">
                        <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-6 text-center">
                            PODIO PROYECTADO
                        </div>
                        <div className="flex items-end justify-center gap-4 md:gap-8">
                            <PodiumBlock driver={p2} position={2} />
                            <PodiumBlock driver={p1} position={1} />
                            <PodiumBlock driver={p3} position={3} />
                        </div>
                    </div>

                    {/* Tables */}
                    <ChampionshipTable standings={standings} constructors={constructors} />
                </>
            )}
        </div>
    )
}
