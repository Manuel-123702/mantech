# Build navbar.tsx from parts
import os

parts_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(parts_dir, 'navbar.tsx')

chunks = []
for name in ["part1.txt", "part2.txt", "part3a.txt", "part3b.txt"]:
    part_path = os.path.join(parts_dir, name)
    with open(part_path, 'r', encoding='utf-8', newline='') as f:
        chunks.append(f.read())

with open(output_path, 'w', encoding='utf-8', newline='') as f:
    f.write(''.join(chunks))

print(f'Written {output_path}')
