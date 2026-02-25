import React from 'react'

const MAX_PTS = 700  // approximate max projected points for bar scaling

export default function ChampionshipTable({ standings, constructors }) {
    if (!standings || standings.length === 0) {
        return (
            <div className="f1-card p-6 text-center text-gray-500 font-rajdhani">
                Sin datos de campeonato
            </div>
        )
    }

    const maxDriverPts = standings[0]?.projected_pts || 1
    const maxConPts = constructors?.[0]?.total_pts || 1

    return (
        <div className="space-y-6">
            {/* Driver Standings */}
            <div className="f1-card overflow-hidden">
                <div className="px-4 py-3 border-b border-f1-border">
                    <span className="font-orbitron text-xs text-gray-400 tracking-widest">
                        STANDINGS — PILOTOS
                    </span>
                </div>
                <div className="divide-y divide-f1-border">
                    {standings.map((driver, i) => {
                        const barW = (driver.projected_pts / maxDriverPts) * 100
                        return (
                            <div key={driver.code} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                {/* Position */}
                                <div className="w-7 font-orbitron text-xs text-gray-600 text-center flex-shrink-0">
                                    {i === 0 ? '🏆' : `P${i + 1}`}
                                </div>
                                {/* Number */}
                                <div
                                    className="w-7 font-orbitron font-bold text-xs text-center flex-shrink-0"
                                    style={{ color: driver.team_color }}
                                >
                                    {driver.number}
                                </div>
                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-rajdhani font-semibold text-sm text-white truncate">
                                        {driver.name}
                                    </div>
                                    <div className="mt-1 h-1 rounded-full" style={{ background: '#1A1A1A' }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${barW}%`, backgroundColor: driver.team_color, opacity: 0.7 }}
                                        />
                                    </div>
                                </div>
                                {/* Points */}
                                <div className="text-right flex-shrink-0">
                                    <div className="font-orbitron font-bold text-sm" style={{ color: driver.team_color }}>
                                        {driver.projected_pts.toFixed(0)}
                                    </div>
                                    <div className="font-rajdhani text-xs text-gray-500">PTS</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Constructor Standings */}
            {constructors && constructors.length > 0 && (
                <div className="f1-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-f1-border">
                        <span className="font-orbitron text-xs text-gray-400 tracking-widest">
                            STANDINGS — CONSTRUCTORES
                        </span>
                    </div>
                    <div className="divide-y divide-f1-border">
                        {constructors.map((team, i) => {
                            const barW = (team.total_pts / maxConPts) * 100
                            return (
                                <div key={team.team} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                    <div className="w-7 font-orbitron text-xs text-gray-600 text-center flex-shrink-0">
                                        {i === 0 ? '🏆' : `P${i + 1}`}
                                    </div>
                                    {/* Team color dot */}
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: team.team_color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-rajdhani font-semibold text-sm text-white">{team.team}</div>
                                        <div className="font-rajdhani text-xs text-gray-500">{team.engine}</div>
                                        <div className="mt-1 h-1 rounded-full" style={{ background: '#1A1A1A' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${barW}%`, backgroundColor: team.team_color, opacity: 0.7 }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-orbitron font-bold text-sm" style={{ color: team.team_color }}>
                                            {team.total_pts.toFixed(0)}
                                        </div>
                                        <div className="font-rajdhani text-xs text-gray-500">PTS</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
