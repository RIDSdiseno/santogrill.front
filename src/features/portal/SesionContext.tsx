import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { get, post } from '../../services/api';
import type { Usuario } from '../../services/tipos';

interface SesionCtx {
  usuario: Usuario | null;
  cargando: boolean;
  entrar: (email: string, clave: string) => Promise<void>;
  salir: () => Promise<void>;
}

const Ctx = createContext<SesionCtx | null>(null);

/**
 * La sesión vive en una cookie httpOnly emitida por la API:
 * el token nunca se guarda en localStorage ni se expone a JS.
 */
export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    get<Usuario>('/auth/me')
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  const entrar = useCallback(async (email: string, clave: string) => {
    setUsuario(await post<Usuario>('/auth/login', { email, clave }));
  }, []);

  const salir = useCallback(async () => {
    await post('/auth/logout', {});
    setUsuario(null);
  }, []);

  return <Ctx.Provider value={{ usuario, cargando, entrar, salir }}>{children}</Ctx.Provider>;
}

export function useSesion() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  return ctx;
}
