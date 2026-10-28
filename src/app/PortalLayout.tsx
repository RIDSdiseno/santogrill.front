import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSesion } from '../features/portal/SesionContext';

const SECCIONES = [
  { to: '/portal', label: 'Resumen', end: true },
  { to: '/portal/pedidos', label: 'Pedidos' },
  { to: '/portal/suscriptores', label: 'Suscriptores' },
  { to: '/portal/mensajes', label: 'Mensajes' },
  { to: '/portal/embudo', label: 'Embudo de eventos' },
  { to: '/portal/visitas', label: 'Visitas' },
  { to: '/portal/productos', label: 'Productos' },
  { to: '/portal/contenido', label: '🖼 Contenido del sitio' },
];

export function PortalLayout() {
  const { usuario, salir } = useSesion();
  const navegar = useNavigate();

  async function cerrar() {
    await salir();
    navegar('/portal/login', { replace: true });
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[224px_minmax(0,1fr)] items-start">
      <aside className="box-border md:sticky md:top-0 md:max-h-screen md:overflow-y-auto bg-[#0f0e0d] border-b md:border-b-0 md:border-r border-borde/60 p-5 flex flex-col gap-1">
        <div className="flex items-center gap-2.5 pb-2">
          <div className="w-8 h-8 rounded-md bg-brasa text-carbon display font-black text-sm grid place-items-center">SG</div>
          <div>
            <div className="display font-extrabold text-[13px]">SANTO GRILL</div>
            <div className="text-[11px] text-ceniza tracking-[0.1em]">PORTAL INTERNO</div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 mt-2">
          {SECCIONES.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.end}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-md display font-bold text-[13px] ${isActive ? 'bg-brasa text-carbon' : 'text-hueso/70 hover:text-hueso'}`
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-borde/60 flex flex-col gap-2">
          <Link to="/" className="text-center display font-bold text-[11px] tracking-[0.08em] text-ceniza border border-borde rounded-md py-2.5 hover:border-brasa hover:text-hueso">
            ← VOLVER AL SITIO
          </Link>
          <div className="text-xs text-ceniza leading-relaxed">
            {usuario?.nombre}
            <br />
            Rol: <span className="text-brasa">{usuario?.rol === 'ADMIN' ? 'Administrador' : 'Ventas'}</span>
          </div>
          <button onClick={cerrar} className="display font-bold text-[11px] tracking-[0.08em] text-ceniza border border-borde rounded-md py-2.5 hover:border-brasa hover:text-hueso">
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      <main className="p-7 pb-16 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
