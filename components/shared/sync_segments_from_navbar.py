# sync_segments_from_navbar.py (one-off repair)
# Regenerates seg1..seg4b.py and part1..part3b.txt FROM the current navbar.tsx
# so the segment pipeline matches the live navbar content exactly.
# NOTE: the first body line is placed inline after the opening triple quotes
# because Python includes a newline that immediately follows """.
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
NAV = os.path.join(BASE, "navbar.tsx")

with open(NAV, "r", encoding="utf-8", newline="") as f:
    src = f.read()

lines = src.splitlines(keepends=True)

def find_idx(pred, start=0, label=""):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    sys.exit("marker not found: " + label)

i_export = find_idx(lambda l: l.startswith("export function Navbar()"), 0, "export function Navbar()")
i_div = find_idx(lambda l: '<div className="hidden items-center gap-x-1 lg:flex">' in l, i_export, "desktop nav container div")
i_right = find_idx(lambda l: "{/* Right-Side Actions" in l, i_div, "right-side actions comment")
i_close = find_idx(lambda l: l.strip() == "</header>", i_right, "</header>")

chunks = {
    "seg1.py": ("SEG1", "seg1.py: Imports and shared constants", "".join(lines[0:i_export])),
    "seg2.py": ("SEG2", "seg2.py: Navbar component start - hooks, state, header/logo", "".join(lines[i_export:i_div + 1])),
    "seg3.py": ("SEG3", "seg3.py: Desktop navigation links with mega dropdowns", "".join(lines[i_div + 1:i_right])),
    "seg4a.py": ("SEG4A", "seg4a.py: Right-side actions + mobile menu", "".join(lines[i_right:i_close])),
    "seg4b.py": ("SEG4B", "seg4b.py: Footer closing", "".join(lines[i_close:])),
}

for fname, (var, doc, body) in chunks.items():
    if body.endswith('"""'):
        sys.exit("triple quote collision in " + fname)
    # Inline first body line right after the opening quotes: this guarantees
    # the parsed value equals the body exactly (no leading newline injected).
    opener = var + ' = """'
    text = '"""\n' + doc + '\n"""\n' + opener + body + '"""\n'
    ns = {}
    exec(text, ns)
    if ns.get(var) != body:
        sys.exit("value mismatch for " + fname)
    with open(os.path.join(BASE, fname), "w", encoding="utf-8", newline="") as f:
        f.write(text)

parts = {
    "part1.txt": chunks["seg1.py"][2],
    "part2.txt": chunks["seg2.py"][2],
    "part3a.txt": chunks["seg3.py"][2] + chunks["seg4a.py"][2],
    "part3b.txt": chunks["seg4b.py"][2],
}
for fname, body in parts.items():
    with open(os.path.join(BASE, fname), "w", encoding="utf-8", newline="") as f:
        f.write(body)

check = "".join(body for _, _, body in chunks.values())
print("segments+parts regenerated;", "MATCH" if check == src else "MISMATCH")
