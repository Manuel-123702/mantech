s = open('c:/mantech_nexus/scripts/gen_seed.py','rb').read()
s = s.replace(b'code += ""];', b"code += '];'")
open('c:/mantech_nexus/scripts/gen_seed.py','wb').write(s)
print('fixed')