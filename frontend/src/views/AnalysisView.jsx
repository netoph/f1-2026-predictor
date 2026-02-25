import React, { useState, useEffect } from 'react'
import RatingsPanel from '../components/RatingsPanel.jsx'
import { fetchRatings, fetchBacktest } from '../api/client.js'

const REGULATORY_CARDS = [
    {
        icon: '⬇️',
        title: 'Carga Aerodinámica',
        value: '-15/30%',
        unit: 'reducción',
        desc: 'Nuevo reglamento 2026 reduce carga aerodinámica hasta 30% en curvas lentas',
        color: '#E8002D',
    },
    {
        icon: '⚡',
        title: 'MGU-K Potencia',
        value: '+291%',
        unit: 'aumento',
        desc: 'Motor eléctrico de 350kW (vs 120kW en 2022). Propulsión eléctrica dominante en aceleración',
        color: '#FF8000',
    },
    {
        icon: '🏹',
        title: 'Resistencia Aerodinámica',
        value: '-40%',
        unit: 'drag',
        desc: 'Active aerodynamics con DRS frontal/trasero mejoran velocidad punta',
        color: '#27F4D2',
    },
    {
        icon: '⚖️',
        title: 'Peso Total',
        value: '770 kg',
        unit: 'mínimo',
        desc: 'Ligero incremento para acomodar baterías 2026 (vs 798kg en 2025)',
        color: '#C0C0C0',
    },
    {
        icon: '📐',
        title: 'Batalla',
        value: '3400 mm',
        unit: 'wheelbase',
        desc: 'Menor batalla que 2024 para favorecer maniobrabilidad en circuitos urbanos',
        color: '#6692FF',
    },
    {
        icon: '🎲',
        title: 'Varianza del Modelo',
        value: '±9%',
        unit: 'ruido',
        desc: 'EL modelo incorpora ±9% de ruido aleatorio para reflejar la incertidumbre regulatoria',
        color: '#FF87BC',
    },
]

function MetricCard({ icon, title, value, unit, desc, color }) {
    return (
        <div
            className="f1-card p-4 hover:border-opacity-50 transition-all group cursor-default"
            style={{ borderColor: `${color}22` }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${color}15` }}
                >
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-orbitron font-bold text-base" style={{ color }}>
                            {value}
                        </span>
                        <span className="font-rajdhani text-xs text-gray-600">{unit}</span>
                    </div>
                    <div className="font-orbitron text-xs text-gray-500 tracking-wide mt-0.5">{title}</div>
                    <div className="font-rajdhani text-xs text-gray-600 mt-2 leading-relaxed">{desc}</div>
                </div>
            </div>
        </div>
    )
}

function BacktestCard({ metrics }) {
    if (!metrics) return null
    return (
        <div className="f1-card p-4">
            <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">
                VALIDACIÓN DEL MODELO (BACKTEST 2024)
            </div>
            {metrics.error ? (
                <div className="font-rajdhani text-sm text-gray-500">{metrics.error}</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'CARRERAS TESTADAS', value: metrics.total_races_tested, unit: '' },
                        { label: 'P1 HIT RATE', value: `${metrics.p1_hit_rate}%`, unit: '' },
                        { label: 'TOP-3 OVERLAP', value: metrics.top3_overlap_per_race, unit: '/carrera' },
                        { label: 'BRIER SCORE', value: metrics.brier_score_podium, unit: '(↓ mejor)' },
                    ].map(m => (
                        <div key={m.label} className="rounded-md p-3" style={{ background: '#181818' }}>
                            <div className="font-orbitron text-xs text-gray-600 tracking-widest">{m.label}</div>
                            <div className="font-orbitron font-bold text-sm text-orange-400 mt-1">{m.value}</div>
                            {m.unit && <div className="font-rajdhani text-xs text-gray-600">{m.unit}</div>}
                        </div>
                    ))}
                </div>
            )}
            {metrics.avg_spearman_rho !== undefined && (
                <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <div className="font-rajdhani text-xs text-gray-500">
                        Spearman ρ (correlación de rangos):
                        <span className="text-orange-400 ml-2 font-bold">{metrics.avg_spearman_rho}</span>
                    </div>
                    <div className="font-rajdhani text-xs text-gray-600">
                        {metrics.interpretation?.overfitting_check}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function AnalysisView() {
    const [ratings, setRatings] = useState(null)
    const [backtestMetrics, setBacktestMetrics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [btLoading, setBtLoading] = useState(false)

    useEffect(() => {
        fetchRatings().then(({ data }) => {
            if (data) setRatings(data)
            setLoading(false)
        })
    }, [])

    const runBacktest = async () => {
        setBtLoading(true)
        const { data } = await fetchBacktest(1000)
        if (data) setBacktestMetrics(data.metrics)
        setBtLoading(false)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Title */}
            <div>
                <div className="font-orbitron font-bold text-white text-lg">ANÁLISIS & RATINGS</div>
                <div className="font-rajdhani text-gray-500 text-sm">Ratings empíricos + impacto regulatorio 2026</div>
            </div>

            {/* Ratings panel */}
            {loading ? (
                <div className="text-center py-10 text-gray-600 font-rajdhani">Cargando ratings...</div>
            ) : (
                <RatingsPanel
                    driverRatings={ratings?.driver_ratings}
                    carRatings={ratings?.car_ratings}
                />
            )}

            {/* Regulatory impact grid */}
            <div>
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">
                    IMPACTO REGULATORIO 2026
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REGULATORY_CARDS.map(card => (
                        <MetricCard key={card.title} {...card} />
                    ))}
                </div>
            </div>

            {/* Backtest */}
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="font-orbitron text-xs text-gray-500 tracking-widest">
                        VALIDACIÓN / BACKTEST
                    </div>
                    <button
                        onClick={runBacktest}
                        disabled={btLoading}
                        className="flex items-center gap-2 px-3 py-1.5 rounded font-orbitron text-xs font-bold tracking-wide transition-all"
                        style={{
                            background: 'linear-gradient(135deg, rgba(232,0,45,0.15), rgba(255,128,0,0.15))',
                            border: '1px solid rgba(255,128,0,0.3)',
                            color: btLoading ? '#555' : '#FF8000',
                        }}
                    >
                        {btLoading ? (
                            <>
                                <div className="w-3 h-3 rounded-full border border-orange-400 border-t-transparent animate-spin" />
                                ANALIZANDO
                            </>
                        ) : (
                            '▶ EJECUTAR BACKTEST 2024'
                        )}
                    </button>
                </div>
                {backtestMetrics ? (
                    <BacktestCard metrics={backtestMetrics} />
                ) : (
                    <div className="f1-card p-4 text-center font-rajdhani text-gray-600 text-sm">
                        Haz clic en "EJECUTAR BACKTEST 2024" para validar el modelo contra resultados reales.
                    </div>
                )}
            </div>

            {/* Methodology note */}
            <div
                className="rounded-lg p-4 font-rajdhani text-xs text-gray-500 leading-relaxed"
                style={{ background: '#0A0A0A', border: '1px solid #151515' }}
            >
                <div className="font-orbitron text-xxs text-gray-700 tracking-widest mb-2">NOTA METODOLÓGICA</div>
                <p>
                    Los ratings se calculan dinámicamente desde la <strong className="text-gray-400">API Jolpica</strong> (espejo público de Ergast).
                    Los resultados de 2024 y 2025 se ponderan 45%/55% respectivamente.
                    Los ajustes cualitativos de chasis reflejan cambios de equipo/motor y estimaciones de rendimiento pre-temporada 2026.
                    El ruido de ±9% en el modelo Monte Carlo captura la incertidumbre inherente al nuevo reglamento técnico.
                    El backtest se ejecuta sobre datos de 2024 usando el mismo pipeline de ratings, sin ajuste fino post-hoc,
                    asegurando una validación <strong className="text-gray-400">fuera de muestra</strong>.
                </p>
            </div>
        </div>
    )
}
