# 🏎️ F1 2026 Predictor Dashboard

Algorithmic prediction dashboard for Formula 1 2026 season using Monte Carlo simulation (8,000 iterations) backed by live data from the [Jolpica API](https://api.jolpi.ca/ergast/f1).

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| API | FastAPI (Python 3.11) via Vercel Serverless Functions |
| Simulation | Monte Carlo vectorized with NumPy |
| Data | Jolpica API (Ergast mirror) — fetched at runtime |
| Deploy | Vercel (monorepo) |

## Project Structure

```
f1-2026-predictor/
├── vercel.json
├── api/              ← FastAPI backend
│   ├── index.py
│   ├── monte_carlo.py
│   ├── ratings.py
│   ├── data.py
│   └── jolpica.py
└── frontend/         ← React + Vite frontend
    ├── src/
    └── ...
```

## Local Development

### Backend (FastAPI)

```bash
cd api
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn index:app --reload --port 8000
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev  # serves on http://localhost:3000
```

> The Vite dev server proxies `/api/*` to `http://localhost:8000`

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | API status check |
| `GET /api/ratings` | Driver & car ratings (cached 1h) |
| `GET /api/race/{round}?iters=8000` | Monte Carlo race prediction |
| `GET /api/championship` | Full season projection |

## Model Methodology

- **Car ratings**: Based on 2024 constructor standings + qualitative 2026 adjustments
- **Driver ratings**: Weighted 2024 (45%) + 2025 (55%) results, qualifying deltas, DNF rates
- **Monte Carlo**: 8,000 iterations per race, ±9% noise (new regulations era)
- **DNF probabilities**: New team 7%, new engine 5%, established 3%
- **Scoring**: FISA points system (25-18-15-12-10-8-6-4-2-1)

## 2026 Grid

22 drivers, 11 teams — McLaren, Ferrari, Red Bull, Mercedes, Aston Martin, Cadillac, Williams, Audi, Alpine, Haas, Racing Bulls.

## Environment Variables (Vercel)

```
JOLPICA_BASE_URL=https://api.jolpi.ca/ergast/f1
CACHE_TTL_SECONDS=3600
```

## Deployment

```bash
# Deploy to Vercel
vercel --prod --yes
```

---

*Data sourced from Jolpica API (public Ergast mirror). Predictions are probabilistic, not deterministic.*
