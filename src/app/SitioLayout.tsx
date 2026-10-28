import { Link, NavLink, Outlet } from 'react-router-dom';
import { CarritoProvider, useCarrito } from '../features/carrito/CarritoContext';
import { useRegistrarVisita } from '../features/visitas/useRegistrarVisita';

const WA = import.meta.env.VITE_WHATSAPP ?? '56961213577';

function NavInterna() {
  useRegistrarVisita();
  const { unidades } = useCarrito();

  return (
    <>
      <header className="sticky top-0 z-50 bg-carbon/95 backdrop-blur border-b border-borde/60">
        <div className="mx-auto max-w-[1240px] px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="https://res.cloudinary.com/dvqpmttci/image/upload/f_auto,q_auto,h_80/v1791896417/sto1_d3tki1.png" alt="Santo Grill" className="h-10 w-auto" />
          </Link>
          <nav className="ml-auto flex items-center gap-4 text-[12px] display font-bold tracking-[0.09em]">
            <NavLink to="/eventos" className={({ isActive }) =>
              (isActive ? 'text-brasa underline underline-offset-4 decoration-brasa decoration-2' : 'text-hueso hover:text-brasa') + ' hidden sm:block'
            }>EVENTOS</NavLink>
            <NavLink to="/tienda" className={({ isActive }) =>
              (isActive ? 'text-brasa underline underline-offset-4 decoration-brasa decoration-2' : 'text-hueso hover:text-brasa') + ' hidden sm:block'
            }>TIENDA ONLINE</NavLink>
            <NavLink to="/agenda" className={({ isActive }) =>
              (isActive ? 'text-brasa' : 'text-hueso hover:text-brasa') + ' hidden md:block'
            }>AGENDA</NavLink>
            <a href="/eventos#galeria" className="hidden lg:block text-hueso hover:text-brasa">GALERÍA</a>
            <a href="/eventos#nosotros" className="hidden lg:block text-hueso hover:text-brasa">NOSOTROS</a>
            <a href="https://instagram.com/santogrill.cl" target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-1.5 text-ceniza hover:text-hueso">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span className="hidden xl:block">@santogrill.cl</span>
            </a>
            <Link to="/tienda" className="relative text-hueso hover:text-brasa">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {unidades > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brasa text-carbon display font-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {unidades > 9 ? '9+' : unidades}
                </span>
              )}
            </Link>
            <a href="/eventos#cotiza" className="bg-brasa text-carbon px-4 py-2.5 rounded-lg hover:brightness-110 display font-black text-[11px] tracking-[0.08em] whitespace-nowrap">
              COTIZA TU EVENTO
            </a>
          </nav>
        </div>
      </header>

      <main><Outlet /></main>

      {/* WhatsApp flotante */}
      <a href={`https://wa.me/${WA}?text=${encodeURIComponent('Hola Santo Grill, necesito información 👋')}`}
        target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-carbon border border-borde text-hueso text-[12px] display font-bold tracking-[0.06em] px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
          Escríbenos
        </span>
        <div className="w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-xl shadow-black/40 hover:scale-110 transition-transform">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.117 1.528 5.847L.057 23.5l5.797-1.522A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.002-1.372l-.36-.214-3.719.977.992-3.638-.234-.374A9.788 9.788 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
          </svg>
        </div>
      </a>

      {/* Footer */}
      <footer className="bg-carbon border-t border-borde/40 pt-14 pb-8" id="nosotros">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid gap-8 sm:grid-cols-[auto_1fr_auto_auto]">
            {/* Logo */}
            <Link to="/">
              <img src="https://res.cloudinary.com/dvqpmttci/image/upload/f_auto,q_auto,h_112/v1791896417/sto1_d3tki1.png" alt="Santo Grill" className="h-16 w-auto" />
            </Link>
            {/* Info */}
            <div className="flex flex-col gap-1.5 text-[13px] text-ceniza">
              <a href="https://instagram.com/santogrill.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-hueso">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                instagram.com/santogrill.cl
              </a>
              <p>Hamburguesas · Parrilla · Eventos · Delivery</p>
              <p>Santiago, Chile</p>
            </div>
            {/* Links */}
            <div className="flex flex-col gap-2 text-[13px]">
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="text-brasa hover:brightness-110">WhatsApp +56 9 6121 3577</a>
              <a href="/eventos#cotiza" className="text-ceniza hover:text-hueso">Cotiza tu evento</a>
              <Link to="/tienda" className="text-ceniza hover:text-hueso">Ir a la tienda online</Link>
              <Link to="/portal" className="inline-flex items-center gap-1.5 display font-bold text-[11px] tracking-[0.08em] border border-borde rounded-md px-3 py-2 hover:border-brasa hover:text-hueso text-ceniza mt-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                PORTAL INTERNO
              </Link>
            </div>
            {/* Tagline script */}
            <div className="flex items-end justify-end">
              <p className="text-brasa text-xl md:text-2xl" style={{ fontFamily: 'Kaushan Script, cursive' }}>
                Santo Grill siempre<br />contigo
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export function SitioLayout() {
  return (
    <CarritoProvider>
      <NavInterna />
    </CarritoProvider>
  );
}
