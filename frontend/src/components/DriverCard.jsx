import React from 'react'

const MEDALS = ['🥇', '🥈', '🥉']
const WDC_CODES = ['NOR']

export default function DriverCard({ driver, rank, isSelected, onClick }) {
    if (!driver) return null

    const { code, name, number, team, team_color, win_pct, podium_pct, rookie, new_team } = driver

    const isWDC = WDC_CODES.includes(code)
    const medal = rank <= 3 ? MEDALS[rank - 1] : null
    const barWidth = Math.min(win_pct * 2.5, 100)

    return (
        <div
            className={`driver-row ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            aria-selected={isSelected}
        >
            {/* Rank */}
            <div className="w-8 text-center flex-shrink-0">
                {medal
                    ? <span className="text-lg">{medal}</span>
                    : <span className="font-orbitron text-xs text-gray-600">P{rank}</span>
                }
            </div>

            {/* Driver number */}
            <div
                className="font-orbitron font-bold text-sm w-8 text-center flex-shrink-0"
                style={{ color: team_color }}
            >
                {number}
            </div>

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-rajdhani font-semibold text-sm text-white tracking-wide">
                        {name}
                    </span>
                    {isWDC && <span className="badge badge-wdc">WDC</span>}
                    {rookie && <span className="badge badge-rookie">ROOKIE</span>}
                    {new_team && !rookie && <span className="badge badge-transfer">↗</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{team}</div>
                {/* Mini win bar */}
                <div className="mt-1.5">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${barWidth}%`, backgroundColor: team_color }}
                        />
                    </div>
                </div>
            </div>

            {/* Win % */}
            <div className="text-right flex-shrink-0">
                <div
                    className="font-orbitron font-bold text-base"
                    style={{ color: team_color }}
                >
                    {win_pct.toFixed(1)}%
                </div>
                <div className="font-rajdhani text-xs text-gray-500">WIN</div>
            </div>
        </div>
    )
}
