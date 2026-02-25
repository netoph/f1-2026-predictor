"""
data.py — F1 2026 static constants: grid, teams, circuits, points system
"""

# 2026 Driver grid: driver_code -> {name, number, team, rookie, new_team, new_engine}
GRID_2026 = {
    "NOR": {"name": "Lando Norris",       "number": 4,  "team": "McLaren",       "rookie": False, "new_team": False, "new_engine": False},
    "PIA": {"name": "Oscar Piastri",      "number": 81, "team": "McLaren",       "rookie": False, "new_team": False, "new_engine": False},
    "LEC": {"name": "Charles Leclerc",    "number": 16, "team": "Ferrari",       "rookie": False, "new_team": False, "new_engine": False},
    "HAM": {"name": "Lewis Hamilton",     "number": 44, "team": "Ferrari",       "rookie": False, "new_team": True,  "new_engine": False},
    "VER": {"name": "Max Verstappen",     "number": 3,  "team": "Red Bull",      "rookie": False, "new_team": False, "new_engine": True},
    "HAD": {"name": "Isack Hadjar",       "number": 6,  "team": "Red Bull",      "rookie": True,  "new_team": True,  "new_engine": True},
    "RUS": {"name": "George Russell",     "number": 63, "team": "Mercedes",      "rookie": False, "new_team": False, "new_engine": False},
    "ANT": {"name": "Kimi Antonelli",     "number": 12, "team": "Mercedes",      "rookie": True,  "new_team": True,  "new_engine": False},
    "ALO": {"name": "Fernando Alonso",    "number": 14, "team": "Aston Martin",  "rookie": False, "new_team": False, "new_engine": True},
    "STR": {"name": "Lance Stroll",       "number": 18, "team": "Aston Martin",  "rookie": False, "new_team": False, "new_engine": True},
    "PER": {"name": "Sergio Perez",       "number": 11, "team": "Cadillac",      "rookie": False, "new_team": True,  "new_engine": False},
    "BOT": {"name": "Valtteri Bottas",    "number": 77, "team": "Cadillac",      "rookie": False, "new_team": True,  "new_engine": False},
    "ALB": {"name": "Alexander Albon",    "number": 23, "team": "Williams",      "rookie": False, "new_team": False, "new_engine": False},
    "SAI": {"name": "Carlos Sainz",       "number": 55, "team": "Williams",      "rookie": False, "new_team": True,  "new_engine": False},
    "HUL": {"name": "Nico Hulkenberg",    "number": 27, "team": "Audi",          "rookie": False, "new_team": True,  "new_engine": True},
    "BOR": {"name": "Gabriel Bortoleto",  "number": 5,  "team": "Audi",          "rookie": True,  "new_team": True,  "new_engine": True},
    "GAS": {"name": "Pierre Gasly",       "number": 10, "team": "Alpine",        "rookie": False, "new_team": False, "new_engine": False},
    "COL": {"name": "Franco Colapinto",   "number": 43, "team": "Alpine",        "rookie": True,  "new_team": True,  "new_engine": False},
    "OCO": {"name": "Esteban Ocon",       "number": 31, "team": "Haas",          "rookie": False, "new_team": True,  "new_engine": False},
    "BEA": {"name": "Oliver Bearman",     "number": 87, "team": "Haas",          "rookie": True,  "new_team": False, "new_engine": False},
    "LAW": {"name": "Liam Lawson",        "number": 30, "team": "Racing Bulls",  "rookie": False, "new_team": False, "new_engine": True},
    "LIN": {"name": "Arvid Lindblad",     "number": 41, "team": "Racing Bulls",  "rookie": True,  "new_team": True,  "new_engine": True},
}

# 2026 Teams: team_name -> {car_adj, color, engine}
TEAMS_2026 = {
    "McLaren":       {"car_adj": +2.5,  "color": "#FF8000", "engine": "Mercedes"},
    "Ferrari":       {"car_adj": +1.0,  "color": "#E8002D", "engine": "Ferrari"},
    "Red Bull":      {"car_adj": -2.0,  "color": "#3671C6", "engine": "Ford (Honda)"},
    "Mercedes":      {"car_adj": +0.5,  "color": "#27F4D2", "engine": "Mercedes"},
    "Aston Martin":  {"car_adj": -2.5,  "color": "#358C75", "engine": "Honda"},
    "Cadillac":      {"car_adj": -10.0, "color": "#FFF500", "engine": "GM (Ferrari client)"},
    "Williams":      {"car_adj": +0.5,  "color": "#64C4FF", "engine": "Mercedes"},
    "Audi":          {"car_adj": -8.0,  "color": "#C0C0C0", "engine": "Audi"},
    "Alpine":        {"car_adj": -1.0,  "color": "#FF87BC", "engine": "Renault"},
    "Haas":          {"car_adj": 0.0,   "color": "#B6BABD", "engine": "Ferrari"},
    "Racing Bulls":  {"car_adj": -1.5,  "color": "#6692FF", "engine": "Ford (Honda)"},
}

# NEW ENGINE FLAG per team (triggers 5% DNF addon)
NEW_ENGINE_TEAMS = {"Red Bull", "Aston Martin", "Audi", "Racing Bulls"}

# 24 Circuits for 2026 season
CIRCUITS = [
    {"round": 1,  "name": "Australia",     "city": "Melbourne",    "type": "permanent", "temp": 22, "overtaking": 5,  "laps": 58},
    {"round": 2,  "name": "China",         "city": "Shanghai",     "type": "permanent", "temp": 15, "overtaking": 6,  "laps": 56},
    {"round": 3,  "name": "Japan",         "city": "Suzuka",       "type": "permanent", "temp": 18, "overtaking": 4,  "laps": 53},
    {"round": 4,  "name": "Bahrain",       "city": "Sakhir",       "type": "permanent", "temp": 29, "overtaking": 7,  "laps": 57},
    {"round": 5,  "name": "Saudi Arabia",  "city": "Jeddah",       "type": "street",    "temp": 33, "overtaking": 3,  "laps": 50},
    {"round": 6,  "name": "Miami",         "city": "Miami",        "type": "street",    "temp": 31, "overtaking": 5,  "laps": 57},
    {"round": 7,  "name": "Emilia Romagna","city": "Imola",        "type": "permanent", "temp": 20, "overtaking": 3,  "laps": 63},
    {"round": 8,  "name": "Monaco",        "city": "Monte Carlo",  "type": "street",    "temp": 23, "overtaking": 2,  "laps": 78},
    {"round": 9,  "name": "Spain",         "city": "Barcelona",    "type": "permanent", "temp": 26, "overtaking": 6,  "laps": 66},
    {"round": 10, "name": "Canada",        "city": "Montréal",     "type": "street",    "temp": 24, "overtaking": 8,  "laps": 70},
    {"round": 11, "name": "Austria",       "city": "Spielberg",    "type": "permanent", "temp": 22, "overtaking": 9,  "laps": 71},
    {"round": 12, "name": "Britain",       "city": "Silverstone",  "type": "permanent", "temp": 18, "overtaking": 7,  "laps": 52},
    {"round": 13, "name": "Belgium",       "city": "Spa",          "type": "permanent", "temp": 17, "overtaking": 10, "laps": 44},
    {"round": 14, "name": "Hungary",       "city": "Budapest",     "type": "permanent", "temp": 30, "overtaking": 4,  "laps": 70},
    {"round": 15, "name": "Netherlands",   "city": "Zandvoort",    "type": "permanent", "temp": 19, "overtaking": 3,  "laps": 72},
    {"round": 16, "name": "Italy",         "city": "Monza",        "type": "permanent", "temp": 25, "overtaking": 10, "laps": 53},
    {"round": 17, "name": "Azerbaijan",    "city": "Baku",         "type": "street",    "temp": 28, "overtaking": 9,  "laps": 51},
    {"round": 18, "name": "Singapore",     "city": "Singapore",    "type": "street",    "temp": 31, "overtaking": 3,  "laps": 62},
    {"round": 19, "name": "United States", "city": "Austin",       "type": "permanent", "temp": 28, "overtaking": 7,  "laps": 56},
    {"round": 20, "name": "Mexico",        "city": "Mexico City",  "type": "permanent", "temp": 23, "overtaking": 5,  "laps": 71},
    {"round": 21, "name": "Brazil",        "city": "São Paulo",    "type": "permanent", "temp": 27, "overtaking": 8,  "laps": 71},
    {"round": 22, "name": "Las Vegas",     "city": "Las Vegas",    "type": "street",    "temp": 15, "overtaking": 7,  "laps": 50},
    {"round": 23, "name": "Qatar",         "city": "Lusail",       "type": "permanent", "temp": 32, "overtaking": 6,  "laps": 57},
    {"round": 24, "name": "Abu Dhabi",     "city": "Yas Marina",   "type": "permanent", "temp": 28, "overtaking": 5,  "laps": 58},
]

# FISA points system
POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] + [0] * 12

# Ordered list of driver codes (consistent indexing for NumPy arrays)
DRIVER_CODES = list(GRID_2026.keys())

# WDC champion badge
WDC_CHAMPIONS = {"NOR"}  # Norris won 2025 WDC
