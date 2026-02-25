import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from './components/Header.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import RaceView from './views/RaceView.jsx'
import ChampionshipView from './views/ChampionshipView.jsx'
import AnalysisView from './views/AnalysisView.jsx'

const LOADING_DURATION = 3400  // ms to show loading screen

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)

    // State synced with URL params
    const activeTab = searchParams.get('tab') || 'race'
    const selectedRound = parseInt(searchParams.get('round') || '1', 10)
    const selectedDriver = searchParams.get('driver') || null

    // Loading screen
    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), LOADING_DURATION)
        return () => clearTimeout(t)
    }, [])

    const updateParams = (updates) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            Object.entries(updates).forEach(([k, v]) => {
                if (v === null || v === undefined) next.delete(k)
                else next.set(k, String(v))
            })
            return next
        })
    }

    const handleTabChange = (tab) => updateParams({ tab, driver: null })
    const handleRoundChange = (round) => updateParams({ round, driver: null })
    const handleDriverChange = (code) => updateParams({ driver: code })

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
                <Header activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Main content */}
                <main className="pt-20 px-4 md:px-8 pb-12 max-w-7xl mx-auto">
                    {activeTab === 'race' && (
                        <div className="animate-fade-in mt-4">
                            <RaceView
                                selectedRound={selectedRound}
                                onRoundChange={handleRoundChange}
                                selectedDriver={selectedDriver}
                                onDriverChange={handleDriverChange}
                            />
                        </div>
                    )}
                    {activeTab === 'championship' && (
                        <div className="animate-fade-in mt-4">
                            <ChampionshipView />
                        </div>
                    )}
                    {activeTab === 'analysis' && (
                        <div className="animate-fade-in mt-4">
                            <AnalysisView />
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer
                    className="text-center py-6 font-rajdhani text-xs text-gray-700 border-t"
                    style={{ borderColor: '#0F0F0F' }}
                >
                    F1 2026 Predictor · Monte Carlo Simulation Engine · Data: Jolpica API
                </footer>
            </div>
        </>
    )
}
