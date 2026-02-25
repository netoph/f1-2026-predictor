import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <div className="text-gray-400 text-xs">P{label}</div>
                <div className="text-white font-bold">{payload[0].value.toFixed(1)}%</div>
            </div>
        )
    }
    return null
}

export default function HeatmapChart({ posDistribution, teamColor }) {
    if (!posDistribution || posDistribution.length === 0) return null

    const data = posDistribution.map(d => ({
        pos: d.pos,
        pct: d.pct,
    }))

    // Color intensity based on pct value
    const maxPct = Math.max(...data.map(d => d.pct), 0.01)

    return (
        <div>
            <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">
                DISTRIBUCIÓN DE POSICIONES
            </div>
            <ResponsiveContainer width="100%" height={110}>
                <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={14}>
                    <XAxis
                        dataKey="pos"
                        tick={{ fill: '#666', fontSize: 9, fontFamily: 'Orbitron' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={v => `P${v}`}
                    />
                    <YAxis
                        tick={{ fill: '#555', fontSize: 9 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={v => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="pct" radius={[3, 3, 0, 0]}>
                        {data.map((entry, index) => {
                            const intensity = entry.pct / maxPct
                            const alpha = 0.2 + intensity * 0.8
                            return (
                                <Cell
                                    key={index}
                                    fill={teamColor}
                                    fillOpacity={alpha}
                                />
                            )
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
