/**
 * client.js — API client for F1 2026 Predictor backend
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

async function apiFetch(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
    try {
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const data = await res.json()
        return { data, error: null }
    } catch (err) {
        console.error(`[API] ${path}:`, err)
        return { data: null, error: err.message }
    }
}

export const fetchHealth = () => apiFetch('/api/health')
export const fetchRatings = () => apiFetch('/api/ratings')
export const fetchCircuits = () => apiFetch('/api/circuits')
export const fetchRace = (round, iters = 8000) => apiFetch(`/api/race/${round}`, { iters })
export const fetchChampionship = (iters = 500) => apiFetch('/api/championship', { iters })
export const fetchBacktest = (iters = 1000) => apiFetch('/api/backtest', { iters })
