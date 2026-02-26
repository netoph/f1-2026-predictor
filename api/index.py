"""
index.py — FastAPI application for Vercel serverless deployment.
Vercel's @vercel/python runtime natively supports ASGI apps via the `app` export.
"""

import sys
import os

# Add api/ directory to path so sibling modules can be imported
_api_dir = os.path.dirname(os.path.abspath(__file__))
if _api_dir not in sys.path:
    sys.path.insert(0, _api_dir)

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from data import CIRCUITS, GRID_2026, TEAMS_2026

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
    from ratings import get_ratings
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


@app.get("/api/race/{gp_round}")
async def race_prediction(
    gp_round: int,
    iters: int = Query(default=8000, ge=100, le=20000),
):
    if gp_round < 1 or gp_round > 24:
        raise HTTPException(status_code=400, detail="Round must be between 1 and 24")
    circuit = next((c for c in CIRCUITS if c["round"] == gp_round), None)
    if not circuit:
        raise HTTPException(status_code=404, detail=f"Circuit for round {gp_round} not found")
    from ratings import get_ratings
    from monte_carlo import run_race_simulation
    data = await get_ratings()
    result = run_race_simulation(
        circuit_round=gp_round,
        iters=iters,
        car_ratings=data["car_ratings"],
        driver_ratings=data["driver_ratings"],
    )
    return result


@app.get("/api/championship")
async def championship_prediction(
    iters: int = Query(default=500, ge=50, le=2000),
):
    from ratings import get_ratings
    from monte_carlo import run_championship_simulation
    data = await get_ratings()
    result = run_championship_simulation(
        iters=iters,
        car_ratings=data["car_ratings"],
        driver_ratings=data["driver_ratings"],
    )
    return result


@app.get("/api/backtest")
async def backtest_endpoint(
    iters: int = Query(default=1000, ge=100, le=3000),
):
    from ratings import get_ratings
    from monte_carlo import backtest_model
    from jolpica import fetch_race_results
    data = await get_ratings()
    historical_results = await fetch_race_results(2024)
    if not historical_results:
        return {"error": "Could not fetch historical results", "metrics": {}}
    metrics = backtest_model(
        historical_results=historical_results,
        car_ratings=data["car_ratings"],
        driver_ratings=data["driver_ratings"],
        iters=iters,
    )
    return {"metrics": metrics, "note": "Backtested against 2024 actuals (out-of-sample)"}


@app.get("/api/circuits")
async def circuits_list():
    return {"circuits": CIRCUITS}
