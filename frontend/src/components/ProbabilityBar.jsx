import React, { useEffect, useRef } from 'react'

export default function ProbabilityBar({ label, value, max = 100, color = '#FF8000', unit = '%', delay = 0 }) {
    const fillRef = useRef(null)

    useEffect(() => {
        const pct = Math.min((value / max) * 100, 100)
        const timer = setTimeout(() => {
            if (fillRef.current) {
                fillRef.current.style.width = `${pct}%`
            }
        }, delay)
        return () => clearTimeout(timer)
    }, [value, max, delay])

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="font-rajdhani text-sm text-gray-400 tracking-wide">{label}</span>
                <span className="font-orbitron text-sm font-bold" style={{ color }}>
                    {typeof value === 'number' ? value.toFixed(1) : value}{unit}
                </span>
            </div>
            <div className="progress-bar h-2">
                <div
                    ref={fillRef}
                    className="progress-bar-fill"
                    style={{
                        width: '0%',
                        backgroundColor: color,
                        transition: `width 0.8s ease-out ${delay}ms`,
                        boxShadow: `0 0 8px ${color}55`,
                    }}
                />
            </div>
        </div>
    )
}
