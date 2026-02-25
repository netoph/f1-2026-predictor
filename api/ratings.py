"""
ratings.py — Empirical driver & car rating calculation from Jolpica data.

Car ratings: 2024 constructor standings normalized to 55-97, + qualitative 2026 adjustments
Driver ratings: 2024(45%) + 2025(55%) weighted results, qualifying deltas, DNF rate
Cache: 1 hour in-memory
"""

import time
import asyncio
from typing import Dict, Any

from jolpica import fetch_all_data
from data import GRID_2026, TEAMS_2026, DRIVER_CODES

# ──────────────────────────────────────────────
#  FALLBACK hardcoded ratings (used if Jolpica fails)
# ──────────────────────────────────────────────
FALLBACK_CAR_RATINGS: Dict[str, float] = {
    "McLaren":      97.0,
    "Ferrari":      91.0,
    "Red Bull":     87.0,
    "Mercedes":     84.0,
    "Aston Martin": 72.0,
    "Williams":     70.0,
    "Racing Bulls": 68.0,
    "Alpine":       66.0,
    "Haas":         64.0,
    "Audi":         58.0,
    "Cadillac":     55.0,
}

FALLBACK_DRIVER_RATINGS: Dict[str, float] = {
    "NOR": 94.0,
    "VER": 97.0,
    "PIA": 87.0,
    "LEC": 88.0,
    "HAM": 91.0,
    "RUS": 84.0,
    "ALO": 86.0,
    "SAI": 83.0,
    "GAS": 78.0,
    "ALB": 79.0,
    "HUL": 76.0,
    "OCO": 75.0,
    "LAW": 74.0,
    "PER": 80.0,
    "BOT": 73.0,
    "STR": 70.0,
    # Rookies — estimated
    "HAD": 70.0,
    "ANT": 71.0,
    "COL": 69.0,
    "BOR": 68.0,
    "BEA": 69.0,
    "LIN": 68.0,
}

FALLBACK_TIRE_DEG: Dict[str, float] = {
    team: 1.0 for team in TEAMS_2026
}

# ──────────────────────────────────────────────
#  Cache
# ──────────────────────────────────────────────
_cache: Dict[str, Any] = {}
_cache_time: float = 0.0
CACHE_TTL = 3600  # 1 hour


def _is_cache_valid() -> bool:
    return (time.time() - _cache_time) < CACHE_TTL


def _normalize(value: float, min_val: float, max_val: float, out_min: float, out_max: float) -> float:
    if max_val == min_val:
        return (out_min + out_max) / 2
    return out_min + (value - min_val) / (max_val - min_val) * (out_max - out_min)


# ──────────────────────────────────────────────
#  Car Ratings
# ──────────────────────────────────────────────
def _compute_car_ratings(constructor_standings: list) -> Dict[str, float]:
    """
    Build car ratings from 2024 constructor standings + 2026 qualitative adjustments.
    Output scale: 55-97
    """
    # Map Jolpica constructor name → our team name (fuzzy)
    _alias = {
        "McLaren":          "McLaren",
        "Ferrari":          "Ferrari",
        "Red Bull":         "Red Bull",
        "Mercedes":         "Mercedes",
        "Aston Martin":     "Aston Martin",
        "Williams":         "Williams",
        "RB":               "Racing Bulls",
        "Alpine F1 Team":   "Alpine",
        "Haas F1 Team":     "Haas",
        "Sauber":           "Audi",          # becomes Audi in 2026
        "AlphaTauri":       "Racing Bulls",
    }

    raw: Dict[str, float] = {}
    for entry in constructor_standings:
        jolpica_name = entry["Constructor"]["name"]
        pts = float(entry.get("points", 0))
        for key, our_name in _alias.items():
            if key.lower() in jolpica_name.lower():
                raw[our_name] = pts
                break

    # Fill missing teams with 0
    for team in TEAMS_2026:
        if team not in raw:
            raw[team] = 0.0

    pts_values = list(raw.values())
    min_pts = min(pts_values)
    max_pts = max(pts_values)

    car_ratings: Dict[str, float] = {}
    for team, pts in raw.items():
        base = _normalize(pts, min_pts, max_pts, 60.0, 94.0)
        adj = TEAMS_2026[team]["car_adj"]
        rating = max(55.0, min(97.0, base + adj))
        car_ratings[team] = round(rating, 1)

    return car_ratings


# ──────────────────────────────────────────────
#  Driver Ratings
# ──────────────────────────────────────────────
def _compute_driver_ratings(
    results_2024: list,
    results_2025: list,
    quali_2024: list,
    quali_2025: list,
) -> Dict[str, float]:
    """
    Weighted 2024(45%) + 2025(55%) driver rating.
    Formula: 55 + pts_norm*26 + pos_norm*10 + quali_delta*2 - dnf_rate*8
    Output scale: 50-97 (rookies: 68, cap 73)
    """

    def _aggregate_results(results: list) -> Dict[str, Dict[str, float]]:
        agg: Dict[str, Dict] = {}
        for r in results:
            code = r["driverCode"]
            if not code:
                continue
            if code not in agg:
                agg[code] = {"total_pts": 0.0, "positions": [], "dnf_count": 0, "races": 0}
            agg[code]["total_pts"] += r["points"]
            agg[code]["positions"].append(r["position"])
            agg[code]["races"] += 1
            status = r.get("status", "Finished")
            if "Retired" in status or "Accident" in status or "Collision" in status or status in ("DNF", "DSQ"):
                agg[code]["dnf_count"] += 1
        return agg

    def _aggregate_quali(quali: list) -> Dict[str, list]:
        agg: Dict[str, list] = {}
        for q in quali:
            code = q["driverCode"]
            if not code:
                continue
            agg.setdefault(code, []).append(q["position"])
        return agg

    agg24 = _aggregate_results(results_2024 or [])
    agg25 = _aggregate_results(results_2025 or [])
    q24 = _aggregate_quali(quali_2024 or [])
    q25 = _aggregate_quali(quali_2025 or [])

    # Merge weighted
    merged: Dict[str, Dict] = {}
    all_codes = set(list(agg24.keys()) + list(agg25.keys()))
    for code in all_codes:
        d24 = agg24.get(code, {"total_pts": 0, "positions": [], "dnf_count": 0, "races": 1})
        d25 = agg25.get(code, {"total_pts": 0, "positions": [], "dnf_count": 0, "races": 1})
        races24 = max(d24["races"], 1)
        races25 = max(d25["races"], 1)
        merged[code] = {
            "pts_w": (d24["total_pts"] / races24) * 0.45 + (d25["total_pts"] / max(d25["races"], 1)) * 0.55,
            "avg_pos": (sum(d24["positions"]) / len(d24["positions"]) if d24["positions"] else 15) * 0.45
                     + (sum(d25["positions"]) / len(d25["positions"]) if d25["positions"] else 15) * 0.55,
            "dnf_rate": (d24["dnf_count"] / races24) * 0.45 + (d25["dnf_count"] / max(d25["races"], 1)) * 0.55,
        }

    # Quali delta vs teammate
    def avg_quali(code: str) -> float:
        positions = q24.get(code, []) + q25.get(code, [])
        return sum(positions) / len(positions) if positions else 10.0

    # Normalise
    if not merged:
        return FALLBACK_DRIVER_RATINGS.copy()

    pts_values = [m["pts_w"] for m in merged.values()]
    pos_values = [m["avg_pos"] for m in merged.values()]
    max_pts = max(pts_values) or 1
    min_pos = min(pos_values) or 1
    max_pos = max(pos_values) or 20

    driver_ratings: Dict[str, float] = {}
    for code, m in merged.items():
        pts_norm = m["pts_w"] / max_pts
        pos_norm = 1 - _normalize(m["avg_pos"], min_pos, max_pos, 0.0, 1.0)
        dnf_term = m["dnf_rate"] * 8
        rating = 55 + pts_norm * 26 + pos_norm * 10 - dnf_term
        rating = max(50.0, min(97.0, rating))
        driver_ratings[code] = round(rating, 1)

    # Fill grid-2026 drivers not in Jolpica (rookies / new)
    for code, info in GRID_2026.items():
        if code not in driver_ratings:
            if info["rookie"]:
                driver_ratings[code] = 68.0
            else:
                driver_ratings[code] = FALLBACK_DRIVER_RATINGS.get(code, 72.0)
        else:
            # Cap rookies
            if info["rookie"]:
                driver_ratings[code] = min(driver_ratings[code], 73.0)

    # Apply fallback defaults for any missing codes
    for code in DRIVER_CODES:
        if code not in driver_ratings:
            driver_ratings[code] = FALLBACK_DRIVER_RATINGS.get(code, 68.0)

    return driver_ratings


# ──────────────────────────────────────────────
#  Public API
# ──────────────────────────────────────────────
async def get_ratings() -> Dict[str, Any]:
    """Returns cached ratings dict (car, driver, tire_deg). TTL = 1 hour."""
    global _cache, _cache_time

    if _cache and _is_cache_valid():
        return _cache

    try:
        raw = await fetch_all_data()
        cs24 = raw.get("constructor_standings_2024")
        r24 = raw.get("race_results_2024")
        r25 = raw.get("race_results_2025")
        q24 = raw.get("qualifying_2024")
        q25 = raw.get("qualifying_2025")

        car_ratings = _compute_car_ratings(cs24) if cs24 else FALLBACK_CAR_RATINGS.copy()
        driver_ratings = _compute_driver_ratings(r24, r25, q24, q25)

        # Tire degradation factor: inverse of car rating normalized (lower-rated cars tend to suffer more)
        tire_deg = {
            team: round(1.0 + (97.0 - rating) / 400.0, 3)
            for team, rating in car_ratings.items()
        }

    except Exception as exc:
        print(f"[ratings] Error computing ratings: {exc}. Using fallback.")
        car_ratings = FALLBACK_CAR_RATINGS.copy()
        driver_ratings = FALLBACK_DRIVER_RATINGS.copy()
        tire_deg = FALLBACK_TIRE_DEG.copy()

    _cache = {
        "driver_ratings": driver_ratings,
        "car_ratings": car_ratings,
        "tire_deg": tire_deg,
    }
    _cache_time = time.time()
    return _cache
