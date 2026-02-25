import React from 'react'

const CIRCUITS = [
    { round: 1, name: 'Australia', short: 'AUS' },
    { round: 2, name: 'China', short: 'CHN' },
    { round: 3, name: 'Japan', short: 'JPN' },
    { round: 4, name: 'Bahrain', short: 'BHR' },
    { round: 5, name: 'Saudi Arabia', short: 'SAU' },
    { round: 6, name: 'Miami', short: 'MIA' },
    { round: 7, name: 'Emilia Romagna', short: 'IMO' },
    { round: 8, name: 'Monaco', short: 'MON' },
    { round: 9, name: 'Spain', short: 'ESP' },
    { round: 10, name: 'Canada', short: 'CAN' },
    { round: 11, name: 'Austria', short: 'AUT' },
    { round: 12, name: 'Britain', short: 'GBR' },
    { round: 13, name: 'Belgium', short: 'BEL' },
    { round: 14, name: 'Hungary', short: 'HUN' },
    { round: 15, name: 'Netherlands', short: 'NED' },
    { round: 16, name: 'Italy', short: 'ITA' },
    { round: 17, name: 'Azerbaijan', short: 'AZE' },
    { round: 18, name: 'Singapore', short: 'SGP' },
    { round: 19, name: 'United States', short: 'USA' },
    { round: 20, name: 'Mexico', short: 'MEX' },
    { round: 21, name: 'Brazil', short: 'BRA' },
    { round: 22, name: 'Las Vegas', short: 'LVS' },
    { round: 23, name: 'Qatar', short: 'QAT' },
    { round: 24, name: 'Abu Dhabi', short: 'ABU' },
]

export default function CircuitSelector({ selectedRound, onSelect }) {
    return (
        <div className="f1-card p-4">
            <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">
                SELECCIONAR GP — TEMPORADA 2026
            </div>
            <div className="flex flex-wrap gap-2">
                {CIRCUITS.map(c => (
                    <button
                        key={c.round}
                        className={`circuit-pill ${selectedRound === c.round ? 'active' : ''}`}
                        onClick={() => onSelect(c.round)}
                        title={c.name}
                    >
                        <span className="text-gray-400 mr-1">R{c.round}</span>
                        <span>{c.short}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
