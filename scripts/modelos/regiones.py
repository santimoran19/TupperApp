import sys; sys.path.insert(0,'/home/claude/clon/recursos/trabajo')
from mh import *
import json
N=13380
REG=['pecho','espalda','hombros','biceps','triceps','antebrazos','abdomen','cuadriceps','isquios','gluteos','pantorrillas']
def normales(v,quads):
    n=np.zeros_like(v)
    for q in quads:
        a,b,c_,d=v[q[0]],v[q[1]],v[q[2]],v[q[3]]
        f=np.cross(c_-a,d-b)
        for i in q: n[i]+=f
    l=np.linalg.norm(n,axis=1,keepdims=True); l[l==0]=1
    return n/l
def etiquetar(v,quads,W,J):
    """devuelve array int (-1 sin región) y valores"""
    n=normales(v,quads)
    # peso por grupo de huesos
    grp={k:np.zeros(len(v)) for k in ('armL','armR','legL','legR','torso','head','hand','foot','clav')}
    for hueso,lista in W['weights'].items():
        h=hueso
        lado='L' if h.endswith('.L') else 'R' if h.endswith('.R') else ''
        if h.startswith(('upperarm','lowerarm')): g='arm'+lado
        elif h.startswith(('clavicle','shoulder01')): g='clav'
        elif h.startswith(('wrist','finger','metacarpal')): g='hand'
        elif h.startswith(('upperleg','lowerleg')): g='leg'+lado
        elif h.startswith(('foot','toe')): g='foot'
        elif h.startswith(('head','neck','jaw','eye','tongue','levator','oculi','oris','orbic','risorius','temporalis','special')): g='head'
        else: g='torso'
        for i,w in lista:
            if i<len(v): grp[g][i]+=w
    reg=np.full(len(v),-1)
    y=v[:,1];x=v[:,0];z=v[:,2]
    sh=J['shoulder'];el=J['elbow'];wr=J['wrist'];kn=J['knee'];an=J['ankle'];ul=J['upleg']
    for i in range(len(v)):
        lado=1 if x[i]>=0 else -1
        # candidatos
        a=grp['armL'][i] if lado>0 else grp['armR'][i]
        l=grp['legL'][i] if lado>0 else grp['legR'][i]
        cl=grp['clav'][i];hd=grp['head'][i];ha=grp['hand'][i];to=grp['torso'][i]
        mx=max(a,l,cl,hd,ha,to,grp['foot'][i])
        if mx==0: continue
        if ha==mx or grp['foot'][i]==mx or hd==mx: continue
        if a==mx:
            p=np.array([abs(x[i]),y[i],z[i]])
            S=np.array([sh[0],sh[1],sh[2]]);E=np.array([el[0],el[1],el[2]]);Wr=np.array([wr[0],wr[1],wr[2]])
            ts=np.dot(p-S,E-S)/np.dot(E-S,E-S)
            if ts<0.28: reg[i]=REG.index('hombros')
            elif ts<1.0: reg[i]=REG.index('biceps' if n[i,2]>=-0.05 else 'triceps')
            else: reg[i]=REG.index('antebrazos')
        elif cl==mx:
            reg[i]=REG.index('hombros')
        elif l==mx:
            if y[i]>kn[1]:
                if y[i]>-1.65 and n[i,2]<-0.05: reg[i]=REG.index('gluteos')
                else: reg[i]=REG.index('cuadriceps' if n[i,2]>0.0 else 'isquios')
            else: reg[i]=REG.index('pantorrillas')
        else:  # torso / pelvis y arranque de las piernas
            if y[i]<0.95:
                if y[i]>-1.65 and n[i,2]<-0.05: reg[i]=REG.index('gluteos')
                elif y[i]>kn[1]:
                    if n[i,2]>=0.0: reg[i]=REG.index('cuadriceps') if y[i]<0.55 else -1
                    else: reg[i]=REG.index('isquios')
                else: reg[i]=REG.index('pantorrillas')
            elif y[i]<J['pecho_bajo']:
                reg[i]=REG.index('abdomen') if n[i,2]>=0.0 else REG.index('espalda')
            elif y[i]<J['cuello']:
                reg[i]=REG.index('pecho') if n[i,2]>=0.0 else REG.index('espalda')
    return reg
