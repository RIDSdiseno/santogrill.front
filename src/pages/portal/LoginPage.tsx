import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Boton } from '../../components/Boton';
import { Campo } from '../../components/Campo';
import { SesionProvider, useSesion } from '../../features/portal/SesionContext';

function Formulario() {
  const { usuario, entrar } = useSesion();
  const navegar = useNavigate();
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/portal" replace />;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await entrar(email, clave);
      navegar('/portal', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(circle_at_50%_0%,#1a1613_0%,#0a0a0a_60%)]">
      <form onSubmit={enviar} className="w-full max-w-sm bg-humo border border-borde rounded-xl p-8 flex flex-col gap-3.5">
        <div className="display font-black text-xl">SANTO GRILL</div>
        <div className="display font-bold text-[11px] tracking-[0.18em] text-brasa">PORTAL INTERNO</div>
        <p className="text-sm text-ceniza">Acceso restringido al equipo. Pedidos, suscriptores, mensajes y eventos.</p>
        <Campo etiqueta="Usuario" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Campo etiqueta="Clave" type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} required />
        {error && <p className="text-sm text-brasa">{error}</p>}
        <Boton type="submit" disabled={enviando}>{enviando ? 'ENTRANDO…' : 'ENTRAR'}</Boton>
        <p className="text-xs text-ceniza/70">Si olvidaste tu clave, pídela al administrador.</p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SesionProvider>
      <Formulario />
    </SesionProvider>
  );
}
