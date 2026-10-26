import { clp } from '../../lib/formato';
import { Boton } from '../../components/Boton';
import type { Producto } from '../../services/tipos';

interface Props { producto: Producto; onAgregar: (p: Producto) => void; }

export function TarjetaProducto({ producto, onAgregar }: Props) {
  return (
    <article className="bg-white text-carbon border border-black/10 rounded-md overflow-hidden flex flex-col hover:border-brasa transition-colors">
      <div className="h-44 bg-humo">
        {producto.imagen && <img src={producto.imagen} alt={producto.nombre} loading="lazy" className="w-full h-full object-cover" />}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="display font-extrabold text-base">{producto.nombre}</h3>
        {producto.descripcion && <p className="text-sm leading-relaxed text-black/60">{producto.descripcion}</p>}
        <div className="mt-auto pt-3 display font-black text-xl">{clp(producto.precio)}</div>
        <Boton onClick={() => onAgregar(producto)}>AGREGAR AL CARRO</Boton>
      </div>
    </article>
  );
}
