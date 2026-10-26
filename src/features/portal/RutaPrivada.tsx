import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { SesionProvider, useSesion } from './SesionContext';

function Guardia({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useSesion();
  if (cargando) return <div className="min-h-screen grid place-items-center text-ceniza">Verificando sesión…</div>;
  if (!usuario) return <Navigate to="/portal/login" replace />;
  return <>{children}</>;
}

/**
 * Esto es UX, no seguridad: la API vuelve a validar sesión y rol
 * en cada request. Ocultar un menú nunca protege un dato.
 */
export function RutaPrivada({ children }: { children: ReactNode }) {
  return (
    <SesionProvider>
      <Guardia>{children}</Guardia>
    </SesionProvider>
  );
}
