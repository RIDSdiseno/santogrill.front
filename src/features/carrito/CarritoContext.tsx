import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Producto } from '../../services/tipos';

export interface LineaCarrito { producto: Producto; cantidad: number; }

type Accion =
  | { tipo: 'agregar'; producto: Producto }
  | { tipo: 'cambiar'; id: string; delta: number }
  | { tipo: 'quitar'; id: string }
  | { tipo: 'vaciar' };

function reducer(estado: LineaCarrito[], accion: Accion): LineaCarrito[] {
  switch (accion.tipo) {
    case 'agregar': {
      const existe = estado.find((l) => l.producto.id === accion.producto.id);
      return existe
        ? estado.map((l) => (l.producto.id === accion.producto.id ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...estado, { producto: accion.producto, cantidad: 1 }];
    }
    case 'cambiar':
      return estado
        .map((l) => (l.producto.id === accion.id ? { ...l, cantidad: l.cantidad + accion.delta } : l))
        .filter((l) => l.cantidad > 0);
    case 'quitar':
      return estado.filter((l) => l.producto.id !== accion.id);
    case 'vaciar':
      return [];
  }
}

interface CarritoCtx {
  lineas: LineaCarrito[];
  unidades: number;
  subtotal: number;
  agregar: (p: Producto) => void;
  cambiar: (id: string, delta: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
}

const Ctx = createContext<CarritoCtx | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [lineas, dispatch] = useReducer(reducer, []);

  const valor = useMemo<CarritoCtx>(() => ({
    lineas,
    unidades: lineas.reduce((n, l) => n + l.cantidad, 0),
    subtotal: lineas.reduce((n, l) => n + l.producto.precio * l.cantidad, 0),
    agregar: (producto) => dispatch({ tipo: 'agregar', producto }),
    cambiar: (id, delta) => dispatch({ tipo: 'cambiar', id, delta }),
    quitar: (id) => dispatch({ tipo: 'quitar', id }),
    vaciar: () => dispatch({ tipo: 'vaciar' })
  }), [lineas]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
}
