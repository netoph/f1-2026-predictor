"""
jolpica.py — Async HTTP client for Jolpica API (Ergast mirror)
"""

import os
import asyncio
import httpx
from typing import Optional, Any

BASE_URL = os.getenv("JOLPICA_BASE_URL", "https://api.jolpi.ca/ergast/f1")
TIMEOUT = 12.0
MAX_RETRIES = 2


async def _get(path: str) -> Optional[dict]:
    """Fetch a JSON resource from Jolpica with retries."""
    url = f"{BASE_URL}{path}.json"
    for attempt in range(MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=TIMEOUT) as client:
                resp = await client.get(url, params={"limit": 1000})
                resp.raise_for_status()
                return resp.json()
        except Exception as exc:
            if attempt == MAX_RETRIES:
                print(f"[jolpica] FAILED {url}: {exc}")
                return None
            await asyncio.sleep(0.5 * (attempt + 1))
    return None


async def fetch_constructor_standings(year: int) -> Optional[list]:
    """Returns list of constructor standing entries for given year."""
    data = await _get(f"/{year}/constructorStandings")
    if not data:
        return None
    try:
        standings = data["MRData"]["StandingsTable"]["StandingsLists"]
        if not standings:
            return None
        return standings[0]["ConstructorStandings"]
    except (KeyError, IndexError):
        return None


async def fetch_race_results(year: int) -> Optional[list]:
    """Returns list of all race results for given year."""
    data = await _get(f"/{year}/results")
    if not data:
        return None
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        # Each race has Results list
        all_results = []
        for race in races:
            for result in race.get("Results", []):
                all_results.append({
                    "round": int(race["round"]),
                    "driverCode": result["Driver"].get("code", ""),
                    "position": int(result.get("position", 99)),
                    "points": float(result.get("points", 0)),
                    "status": result.get("status", "Finished"),
                })
        return all_results
    except (KeyError, TypeError):
        return None


async def fetch_qualifying_results(year: int) -> Optional[list]:
    """Returns list of all qualifying results for given year."""
    data = await _get(f"/{year}/qualifying")
    if not data:
        return None
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        all_quali = []
        for race in races:
            for result in race.get("QualifyingResults", []):
                all_quali.append({
                    "round": int(race["round"]),
                    "driverCode": result["Driver"].get("code", ""),
                    "position": int(result.get("position", 99)),
                })
        return all_quali
    except (KeyError, TypeError):
        return None


async def fetch_all_data() -> dict:
    """Fetch all required data concurrently."""
    results = await asyncio.gather(
        fetch_constructor_standings(2024),
        fetch_race_results(2024),
        fetch_race_results(2025),
        fetch_qualifying_results(2024),
        fetch_qualifying_results(2025),
        return_exceptions=False,
    )
    return {
        "constructor_standings_2024": results[0],
        "race_results_2024": results[1],
        "race_results_2025": results[2],
        "qualifying_2024": results[3],
        "qualifying_2025": results[4],
    }
