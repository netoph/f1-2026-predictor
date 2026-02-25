"""
index.py — FastAPI main application for F1 2026 Predictor API.
Wrapped with Mangum for Vercel Serverless Functions.
"""

import asyncio
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from data import CIRCUITS, GRID_2026, TEAMS_2026
from ratings import get_ratings
from monte_carlo import run_race_simulation, run_championship_simulation, backtest_model
from jolpica import fetch_race_results

app = FastAPI(
    title="F1 2026 Predictor API",
    description="Monte Carlo simulation engine for Formula 1 2026 season predictions",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    """API health check and data source status."""
    return {
        "status": "ok",
        "version": "1.0.0",
        "season": 2026,
        "data_sources": ["jolpica_2024", "jolpica_2025"],
        "drivers": len(GRID_2026),
        "circuits": len(CIRCUITS),
    }


@app.get("/api/ratings")
async def ratings_endpoint():
    """
    Returns empirical driver & car ratings calculated from Jolpica data.
    Cached in memory for 1 hour.
    """
    data = await get_ratings()
    return {
        "driver_ratings": data["driver_ratings"],
        "car_ratings": data["car_ratings"],
        "tire_deg": data["tire_deg"],
        "teams_info": {
            team: {
                "color": info["color"],
                "engine": info["engine"],
                "car_adj_2026": info["car_adj"],
            }
            for team, info in TEAMS_2026.items()
        }
    }


@app.get("/api/race/{round}")
async def race_prediction(
    round: int,
    iters: int = Query(default=8000, ge=100, le=20000, description="Monte Carlo iterations"),
):
    """
    Run Monte Carlo simulation for a specific GP round.
    """
    if round < 1 or round > 24:
        raise HTTPException(status_code=400, detail="Round must be between 1 and 24")

    circuit = next((c for c in CIRCUITS if c["round"] == round), None)
    if not circuit:
        raise HTTPException(status_code=404, detail=f"Circuit for round {round} not found")

    data = await get_ratings()
    car_ratings = data["car_ratings"]
    driver_ratings = data["driver_ratings"]

    result = run_race_simulation(
        circuit_round=round,
        iters=iters,
        car_ratings=car_ratings,
        driver_ratings=driver_ratings,
    )

    return result


@app.get("/api/championship")
async def championship_prediction(
    iters: int = Query(default=500, ge=50, le=2000, description="Iterations per race"),
):
    """
    Simulate all 24 GPs and project full championship standings.
    """
    data = await get_ratings()
    car_ratings = data["car_ratings"]
    driver_ratings = data["driver_ratings"]

    result = run_championship_simulation(
        iters=iters,
        car_ratings=car_ratings,
        driver_ratings=driver_ratings,
    )

    return result


@app.get("/api/backtest")
async def backtest_endpoint(
    iters: int = Query(default=1000, ge=100, le=3000, description="Iterations per race"),
):
    """
    Validate model against 2024 historical results.
    Returns accuracy metrics: P1 hit rate, Brier score, Spearman rho.
    """
    data = await get_ratings()
    car_ratings = data["car_ratings"]
    driver_ratings = data["driver_ratings"]

    # Fetch 2024 actuals for validation
    historical_results = await fetch_race_results(2024)

    if not historical_results:
        return {
            "error": "Could not fetch historical results from Jolpica",
            "metrics": {}
        }

    metrics = backtest_model(
        historical_results=historical_results,
        car_ratings=car_ratings,
        driver_ratings=driver_ratings,
        iters=iters,
    )

    return {"metrics": metrics, "note": "Backtested against 2024 actuals (out-of-sample)"}


@app.get("/api/circuits")
async def circuits_list():
    """Returns list of all 24 circuits for 2026 season."""
    return {"circuits": CIRCUITS}


# Vercel serverless handler
handler = Mangum(app, lifespan="off")
