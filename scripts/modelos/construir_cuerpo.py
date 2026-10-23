# Arma public/modelos/cuerpo.bin a partir de la malla base de MakeHuman (CC0): la malla del cuerpo, las deformaciones de
# sexo, peso y músculo y la región muscular de cada punto. Uso: python3 construir_cuerpo.py <carpeta de MakeHuman> <salida>
import sys, json, struct
sys.path.insert(0, '.')
from mh import *
from regiones import *
v, c = leer_obj(); NT = len(v)
quads = c['body']
T = D + 'targets/macrodetails/'
base = v[:N]
J = dict(shoulder=[1.68,5.25,0.15], elbow=[3.13,3.49,0.13], wrist=[4.31,2.45,0.5], knee=[1.58,-3.69,.32], ankle=[2.2,-7.45,0], upleg=[1.1,.49,.12], pecho_bajo=3.5, cuello=5.8)
W = json.load(open(D+'rigs/default_weights.mhw'))
reg = etiquetar(base, quads, W, J).astype(np.int16)
reg[reg < 0] = 255
# Etnia: promedio de las tres (para no imponer ninguna)
E = {g: sum(leer_target(f'{T}{e}-{g}-young.target', NT) for e in ('african','asian','caucasian'))/3 for g in ('female','male')}
deltas = []; claves = []
for g in ('female', 'male'):
    for m in ('average', 'max'):
        for w in ('min', 'average', 'max'):
            d = leer_target(f'{T}universal-{g}-young-{m}muscle-{w}weight.target', NT)[:N] + E[g][:N]
            deltas.append(d); claves.append(f'{g}-{m}-{w}')
tri = []
for q in quads: tri += [(q[0],q[1],q[2]), (q[0],q[2],q[3])]
tri = np.array(tri, dtype=np.uint16)
pos = (base*0.1).astype(np.float32)   # decímetros a metros
escalas = []; datos = []
for d in deltas:
    d = d*0.1; s = float(np.abs(d).max())/127 or 1.0
    escalas.append(s); datos.append(np.round(d/s).astype(np.int8))
cab = json.dumps(dict(n=N, tri=len(tri), claves=claves, escalas=escalas, regiones=REG)).encode()
cab += b' '*((4-len(cab)%4)%4)
with open(sys.argv[1] if len(sys.argv)>1 else 'cuerpo.bin', 'wb') as f:
    f.write(struct.pack('<I', len(cab))); f.write(cab)
    f.write(pos.tobytes()); f.write(tri.tobytes()); 
    if (len(tri)*6)%4: f.write(b'\0'*(4-(len(tri)*6)%4))
    f.write(reg.astype(np.uint8).tobytes())
    if N%4: f.write(b'\0'*(4-N%4))
    for d in datos: f.write(d.tobytes())
import os; print(os.path.getsize(sys.argv[1] if len(sys.argv)>1 else 'cuerpo.bin'))
