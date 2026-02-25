import React from 'react'

const TABS = [
    { id: 'race', label: 'Carrera' },
    { id: 'championship', label: 'Campeonato' },
    { id: 'analysis', label: 'Análisis' },
]

export default function Header({ activeTab, onTabChange }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Red-orange gradient bar */}
            <div
                className="h-1 w-full"
                style={{ background: 'linear-gradient(90deg, #E8002D, #FF8000, #E8002D)' }}
            />
            {/* Main header */}
            <div
                className="flex items-center justify-between px-4 md:px-8 py-3"
                style={{ background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1A1A1A' }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded flex items-center justify-center font-orbitron font-black text-sm"
                        style={{ background: 'linear-gradient(135deg, #E8002D, #FF8000)' }}
                    >
                        F1
                    </div>
                    <div>
                        <div className="font-orbitron font-bold text-sm text-white tracking-widest">
                            2026 PREDICTOR
                        </div>
                        <div className="font-rajdhani text-xs text-gray-500 tracking-wide">
                            MONTE CARLO SIMULATOR
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <nav className="flex items-center gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Status dot */}
                <div className="hidden md:flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-subtle" />
                    <span className="font-rajdhani text-xs text-gray-500 tracking-wide">LIVE DATA</span>
                </div>
            </div>
        </header>
    )
}
