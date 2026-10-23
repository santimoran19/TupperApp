import numpy as np, json, re, os
D='/home/claude/clon/recursos/mh/makehuman/data/'
def leer_obj(p=D+'3dobjs/base.obj'):
    v=[];grupo=None;caras={}
    for l in open(p):
        if l.startswith('v '): v.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('g '): grupo=l.split()[1]
        elif l.startswith('f '):
            idx=[int(t.split('/')[0])-1 for t in l.split()[1:]]
            caras.setdefault(grupo,[]).append(idx)
    return np.array(v),caras
def leer_target(p,n):
    d=np.zeros((n,3))
    for l in open(p):
        if l.startswith('#') or not l.strip(): continue
        t=l.split()
        d[int(t[0])]=[float(x) for x in t[1:4]]
    return d
