import React, { useState, useEffect } from 'react'

const STEPS = [
    { id: 0, text: 'CONECTANDO A JOLPICA API', delay: 300 },
    { id: 1, text: 'CARGANDO RESULTADOS 2024', delay: 900 },
    { id: 2, text: 'CARGANDO RESULTADOS 2025', delay: 1500 },
    { id: 3, text: 'CALCULANDO RATINGS EMPÍRICOS', delay: 2200 },
    { id: 4, text: 'MODELO LISTO', delay: 2900 },
]

export default function LoadingScreen() {
    const [visibleSteps, setVisibleSteps] = useState([])
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)

    useEffect(() => {
        const timers = STEPS.map(step =>
            setTimeout(() => {
                setVisibleSteps(prev => [...prev, step.id])
                setProgress(((step.id + 1) / STEPS.length) * 100)
                if (step.id === STEPS.length - 1) {
                    setTimeout(() => setDone(true), 300)
                }
            }, step.delay)
        )
        return () => timers.forEach(clearTimeout)
    }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(8px)' }}
        >
            {/* Logo */}
            <div className="mb-8 text-center">
                <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-lg font-orbitron font-black text-2xl mb-4"
                    style={{ background: 'linear-gradient(135deg, #E8002D, #FF8000)', boxShadow: '0 0 40px rgba(232,0,45,0.4)' }}
                >
                    F1
                </div>
                <div className="font-orbitron font-bold text-lg tracking-widest text-white">
                    2026 PREDICTOR
                </div>
                <div className="font-rajdhani text-sm text-gray-500 tracking-widest mt-1">
                    INITIALIZING MONTE CARLO ENGINE
                </div>
            </div>

            {/* Terminal box */}
            <div
                className="w-full max-w-lg mx-4 rounded-lg p-5"
                style={{ background: '#080808', border: '1px solid #1A1A1A' }}
            >
                <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #1A1A1A' }}>
                    <div className="w-3 h-3 rounded-full bg-red-500 opacity-70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
                    <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
                    <span className="font-orbitron text-xs text-gray-600 ml-2">f1-predictor v1.0</span>
                </div>

                {STEPS.map(step => (
                    <div
                        key={step.id}
                        className={`terminal-line flex items-center gap-3 py-1.5 transition-opacity duration-300
              ${visibleSteps.includes(step.id) ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {visibleSteps.includes(step.id) ? (
                            <>
                                <span style={{ color: step.id === STEPS.length - 1 ? '#00FF88' : '#FF8000' }}>●</span>
                                <span
                                    className="text-xs tracking-wide"
                                    style={{ color: step.id === STEPS.length - 1 ? '#00FF88' : '#888' }}
                                >
                                    {step.text}
                                    {step.id === STEPS.length - 1 ? (
                                        <span className="ml-2 text-green-400">✓</span>
                                    ) : (
                                        <span className="text-gray-600">...</span>
                                    )}
                                </span>
                            </>
                        ) : null}
                    </div>
                ))}

                {/* Cursor on last line if still loading */}
                {visibleSteps.length < STEPS.length && (
                    <div className="terminal-line flex items-center gap-3 py-1.5">
                        <span className="text-orange-400">●</span>
                        <span className="text-xs text-gray-500">
                            <span className="terminal-cursor" />
                        </span>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-lg mx-4 mt-4">
                <div className="progress-bar h-1.5">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #E8002D, #FF8000)',
                            transition: 'width 0.5s ease-out',
                            boxShadow: '0 0 10px rgba(255,128,0,0.5)',
                        }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="font-orbitron text-xs text-gray-700">0%</span>
                    <span className="font-orbitron text-xs" style={{ color: '#FF8000' }}>
                        {progress.toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    )
}
