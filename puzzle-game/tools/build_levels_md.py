#!/usr/bin/env python3
"""Validate puzzle-game/levels.json, render LEVELS.md, and write app/js/levels-data.js for the game."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "levels.json").read_text(encoding="utf-8"))
levels = data["levels"]
worlds = {w["id"]: w["name"] for w in data["worlds"]}

# --- validation ---
REQUIRED = ["id", "world", "difficulty", "mechanic", "question", "screen", "solution", "hints", "why"]
ids = [lv["id"] for lv in levels]
assert ids == list(range(1, len(levels) + 1)), "level ids must be 1..N with no gaps"
for lv in levels:
    missing = [k for k in REQUIRED if k not in lv]
    assert not missing, f"level {lv['id']} missing {missing}"
    assert lv["difficulty"] in ("easy", "medium", "hard"), lv["id"]
    assert len(lv["hints"]) == 2, f"level {lv['id']} needs 2 hints"
    assert lv["world"] == (lv["id"] - 1) // 25 + 1, f"level {lv['id']} in wrong world"
    if lv["mechanic"].startswith("device"):
        assert "fallback" in lv, f"device level {lv['id']} needs a web fallback"

diff = Counter(lv["difficulty"] for lv in levels)
cost = data["economy"]["hintCosts"]

# --- render ---
out = [
    "# Puzzle Levels: 100-Level Launch Set",
    "",
    "_Generated from `levels.json` by `tools/build_levels_md.py`. Edit the JSON, not this file._",
    "",
    f"**Total:** {len(levels)} levels · "
    f"**Easy:** {diff['easy']} · **Medium:** {diff['medium']} · **Hard:** {diff['hard']}",
    "",
    f"**Hint prices:** Nudge {cost['nudge']} coins · Strong hint {cost['strong']} coins · "
    f"Full solution {cost['solution']} coins",
    "",
]
for wid, name in worlds.items():
    wl = [lv for lv in levels if lv["world"] == wid]
    out += [f"## World {wid}: {name} (levels {wl[0]['id']}–{wl[-1]['id']})", ""]
    for lv in wl:
        out += [
            f"### {lv['id']}. {lv['question']}",
            f"*{lv['difficulty'].capitalize()} · {lv['mechanic']}*",
            "",
            f"- **On screen:** {lv['screen']}",
            f"- **Nudge hint:** {lv['hints'][0]}",
            f"- **Strong hint:** {lv['hints'][1]}",
            f"- **Solution:** {lv['solution']}",
        ]
        if "fallback" in lv:
            out.append(f"- **No-sensor fallback:** {lv['fallback']}")
        out += [f"- **Why:** {lv['why']}", ""]

(ROOT / "LEVELS.md").write_text("\n".join(out), encoding="utf-8")

# --- game data file (the app loads this instead of fetching JSON) ---
js = "/* Generated from levels.json by tools/build_levels_md.py. Do not edit. */\n"
js += "window.LEVEL_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
(ROOT / "app" / "js" / "levels-data.js").write_text(js, encoding="utf-8")
print(f"OK: {len(levels)} levels -> LEVELS.md + app/js/levels-data.js  {dict(diff)}")
