import { Link } from 'react-router-dom';

export default function SelectorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 py-16" style={{ background: '#0a0a0a' }}>
      <div className="flex flex-col items-center gap-2">
        <img
          src="https://res.cloudinary.com/dvqpmttci/image/upload/f_auto,q_auto,h_112/v1791896417/sto1_d3tki1.png"
          alt="Santo Grill"
          className="h-20 w-auto mb-4"
        />
        <h1 className="display font-black text-2xl md:text-3xl text-hueso tracking-[0.04em]">¿QUÉ ESTÁS BUSCANDO?</h1>
        <p className="text-ceniza text-[14px]">Elige una opción para continuar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <Link to="/tienda" className="group relative overflow-hidden rounded-2xl" style={{ minHeight: 260 }}>
          <img src="/images/ec-cat1-pizza.jpg" alt="Tienda Online" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'brightness(0.55)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div>
              <div className="display font-black text-2xl text-hueso">TIENDA ONLINE</div>
              <p className="text-hueso/70 text-[13px] mt-1">Pizzas, costillas y más con despacho</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brasa flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-carbon" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" /></svg>
            </div>
          </div>
        </Link>

        <Link to="/eventos" className="group relative overflow-hidden rounded-2xl" style={{ minHeight: 260 }}>
          <img src="/images/ev-g3-parrilla.jpg" alt="Eventos" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ filter: 'brightness(0.55)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div>
              <div className="display font-black text-2xl text-hueso">EVENTOS</div>
              <p className="text-hueso/70 text-[13px] mt-1">Parrilla y food truck para tu celebración</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brasa flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-carbon" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" /></svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
