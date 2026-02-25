import React from 'react'

const TEAM_ENGINES = {
    McLaren: 'Mercedes', Ferrari: 'Ferrari', 'Red Bull': 'Ford (Honda)',
    Mercedes: 'Mercedes', 'Aston Martin': 'Honda', Cadillac: 'GM Client',
    Williams: 'Mercedes', Audi: 'Audi', Alpine: 'Renault',
    Haas: 'Ferrari', 'Racing Bulls': 'Ford (Honda)',
}

const TEAM_COLORS = {
    McLaren: '#FF8000', Ferrari: '#E8002D', 'Red Bull': '#3671C6',
    Mercedes: '#27F4D2', 'Aston Martin': '#358C75', Cadillac: '#FFF500',
    Williams: '#64C4FF', Audi: '#C0C0C0', Alpine: '#FF87BC',
    Haas: '#B6BABD', 'Racing Bulls': '#6692FF',
}

function RatingBar({ value, maxVal = 100, color, label, sublabel }) {
    const width = Math.min((value / maxVal) * 100, 100)
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="w-32 flex-shrink-0 text-right">
                <div className="font-rajdhani text-sm text-white font-semibold truncate">{label}</div>
                {sublabel && <div className="font-rajdhani text-xs text-gray-500">{sublabel}</div>}
            </div>
            <div className="flex-1">
                <div className="progress-bar h-2">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${width}%`,
                            backgroundColor: color,
                            transition: 'width 0.9s ease-out',
                            boxShadow: `0 0 6px ${color}55`,
                        }}
                    />
                </div>
            </div>
            <div className="w-10 text-right font-orbitron text-xs font-bold" style={{ color }}>
                {value.toFixed(0)}
            </div>
        </div>
    )
}

export default function RatingsPanel({ driverRatings, carRatings }) {
    if (!driverRatings || !carRatings) {
        return (
            <div className="text-center text-gray-500 font-rajdhani p-8">
                Cargando ratings...
            </div>
        )
    }

    const driversArray = Object.entries(driverRatings)
        .map(([code, rating]) => ({ code, rating }))
        .sort((a, b) => b.rating - a.rating)

    const carsArray = Object.entries(carRatings)
        .map(([team, rating]) => ({ team, rating, color: TEAM_COLORS[team] || '#888' }))
        .sort((a, b) => b.rating - a.rating)

    const maxDriverRating = driversArray[0]?.rating || 100
    const maxCarRating = carsArray[0]?.rating || 100

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Ratings */}
            <div className="f1-card p-4">
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">
                    RATING PILOTO 2026
                </div>
                <div className="divide-y divide-f1-border">
                    {driversArray.map(({ code, rating }) => (
                        <RatingBar
                            key={code}
                            label={code}
                            value={rating}
                            maxVal={maxDriverRating}
                            color="#FF8000"
                        />
                    ))}
                </div>
                <div className="mt-3 font-rajdhani text-xs text-gray-600">
                    Basado en resultados 2024 (45%) + 2025 (55%) · Escala 50–97
                </div>
            </div>

            {/* Car Ratings */}
            <div className="f1-card p-4">
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">
                    RATING CHASIS 2026
                </div>
                <div className="divide-y divide-f1-border">
                    {carsArray.map(({ team, rating, color }) => (
                        <RatingBar
                            key={team}
                            label={team}
                            sublabel={TEAM_ENGINES[team]}
                            value={rating}
                            maxVal={maxCarRating}
                            color={color}
                        />
                    ))}
                </div>
                <div className="mt-3 font-rajdhani text-xs text-gray-600">
                    Standings 2024 + ajustes cualitativos 2026 · Escala 55–97
                </div>
            </div>
        </div>
    )
}
