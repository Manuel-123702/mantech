# build_navbar.py
# Assembles navbar.tsx from small string segments
# Each segment file defines a variable containing a Python string

import os

parts_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(parts_dir, "navbar.tsx")

seg_names = ["seg1.py", "seg2.py", "seg3.py", "seg4a.py", "seg4b.py"]
segments = []
for seg_name in seg_names:
    seg_path = os.path.join(parts_dir, seg_name)
    namespace = {}
    with open(seg_path, "r", encoding="utf-8") as f:
        exec(f.read(), namespace)
    for key, value in namespace.items():
        if key.startswith("SEG") and isinstance(value, str):
            segments.append(value)

with open(output_path, "w", encoding="utf-8", newline="") as f:
    for seg in segments:
        f.write(seg)

print(f"Written {output_path} ({os.path.getsize(output_path)} bytes)")
