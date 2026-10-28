import { clp } from '../../lib/formato';
import { Boton } from '../../components/Boton';
import type { Producto } from '../../services/tipos';

interface Props { producto: Producto; onAgregar: (p: Producto) => void; }

export function TarjetaProducto({ producto, onAgregar }: Props) {
  return (
    <article className="group bg-humo border border-borde/50 rounded-2xl overflow-hidden flex flex-col hover:border-brasa/60 transition-colors">
      <div className="h-44 bg-carbon overflow-hidden relative">
        {producto.imagen
          ? <img src={producto.imagen} alt={producto.nombre} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-ceniza/30 text-4xl">🍕</div>
        }
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="display font-black text-[11px] tracking-[0.1em] text-brasa uppercase">{producto.categoria}</div>
        <h3 className="display font-extrabold text-[15px] text-hueso leading-snug">{producto.nombre}</h3>
        {producto.descripcion && <p className="text-[12px] leading-relaxed text-ceniza flex-1">{producto.descripcion}</p>}
        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <span className="display font-black text-xl text-hueso">{clp(producto.precio)}</span>
        </div>
        <Boton onClick={() => onAgregar(producto)}>AGREGAR AL CARRO</Boton>
      </div>
    </article>
  );
}
