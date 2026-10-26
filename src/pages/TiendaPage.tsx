import { useMemo, useState } from 'react';
import { get } from '../services/api';
import { useFetch } from '../lib/useFetch';
import type { Producto } from '../services/tipos';
import { TarjetaProducto } from '../features/catalogo/TarjetaProducto';
import { PanelCarrito } from '../features/carrito/PanelCarrito';
import { ModalBienvenida } from '../features/suscripcion/ModalBienvenida';
import { useCarrito } from '../features/carrito/CarritoContext';
import { useSuscriptor } from '../features/suscripcion/useSuscriptor';

const CATEGORIAS = [
  { id: 'todas', label: 'Todas', icon: null },
  { id: 'pizzas', label: 'Pizzas', icon: '/images/ec-cat1-pizza.jpg' },
  { id: 'costillas', label: 'Costillas', icon: '/images/ev-g1-costillar.jpg' },
  { id: 'alitas', label: 'Alitas', icon: '/images/ec-cat3-alitas.jpg' },
  { id: 'carnes', label: 'Carnes', icon: '/images/ec-p13-carne-mechada.png' },
  { id: 'complementos', label: 'Complementos', icon: '/images/ec-p14-carbon.png' },
  { id: 'packs', label: 'Packs', icon: '/images/ec-cat4-pack.jpg' },
];

const PACKS = [
  {
    slug: 'pack-para-2',
    nombre: 'Pack Santo Grill para 2',
    items: ['1 Pizza a elección', '1 Costillar (medio)', '1 Porción de alitas'],
    precio: 26290,
    precioAntes: 31490,
    img: '/images/ec-cat4-pack.jpg',
  },
  {
    slug: 'pack-parrillero',
    nombre: 'Pack Parrillero',
    items: ['2 Costillares (medios)', '2 Porciones de alitas', 'Papas rústicas'],
    precio: 36790,
    precioAntes: 41990,
    img: '/images/ec-pk2-parrillero.jpg',
  },
  {
    slug: 'pack-full',
    nombre: 'Pack Full Santo Grill',
    items: ['2 Pizzas', '2 Costillares (medios)', '2 Porciones de alitas', 'Papas rústicas'],
    precio: 57790,
    precioAntes: 68290,
    img: '/images/ec-pk3-full.jpg',
  },
];

const WA = '56961213577';

export default function TiendaPage() {
  const { data, error, cargando } = useFetch(() => get<Producto[]>('/productos'), []);
  const { agregar } = useCarrito();
  const { esSuscriptor } = useSuscriptor();
  const [categoria, setCategoria] = useState('todas');

  const productos = useMemo(
    () => (data ?? []).filter((p) => categoria === 'todas' || p.categoria === categoria),
    [data, categoria]
  );

  return (
    <>
      <ModalBienvenida />

      {/* Hero */}
      <section className="relative bg-carbon overflow-hidden" style={{ height: 520 }}>
        <img
          src="/images/ev-g1-costillar.jpg"
          alt="Costillar BBQ con fuego"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          style={{ filter: 'brightness(0.55)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.15) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="inline-flex items-center gap-2 bg-brasa/15 border border-brasa/30 rounded-full px-4 py-1.5 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-brasa animate-pulse" />
              <span className="display font-bold text-[11px] tracking-[0.12em] text-brasa">DESPACHO EN SANTIAGO</span>
            </div>
            <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Nuestros</p>
            <h1 className="display font-black text-5xl sm:text-6xl leading-[0.95] text-hueso mt-1">
              PRODUCTOS
            </h1>
            <div className="w-44 h-1 bg-brasa mt-4 mb-5" />
            <p className="max-w-lg text-[17px] text-hueso/75 leading-relaxed">
              Pizzas de masa madre, costillas ahumadas y alitas listas para calentar y disfrutar en casa.
            </p>
            <div className="mt-7 flex flex-wrap gap-4 text-[13px] text-ceniza">
              <span className="flex items-center gap-1.5"><span className="text-brasa">✓</span> Despacho gratis sobre $40.000</span>
              <span className="flex items-center gap-1.5"><span className="text-brasa">✓</span> Productos ultracongelados</span>
              <span className="flex items-center gap-1.5"><span className="text-brasa">✓</span> Compra segura vía WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packs */}
      <section className="bg-humo py-16 border-b border-borde/40">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-10 flex items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Más sabor, mejor precio</p>
              <h2 className="display font-black text-3xl text-hueso mt-1">PACKS <span className="text-brasa">SANTO GRILL</span></h2>
              <div className="w-36 h-1 bg-brasa mt-2" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PACKS.map((pk) => {
              const pct = Math.round((1 - pk.precio / pk.precioAntes) * 100);
              return (
                <div key={pk.slug} className="group rounded-2xl overflow-hidden border border-borde bg-carbon flex flex-col hover:border-brasa/50 transition-colors">
                  <div className="h-52 overflow-hidden relative">
                    <img src={pk.img} alt={pk.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />
                    <span className="absolute top-3 right-3 bg-brasa text-carbon display font-black text-[11px] px-2.5 py-1 rounded-full">
                      {pct}% OFF
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="display font-black text-lg text-hueso">{pk.nombre}</div>
                    <ul className="flex-1 space-y-1.5">
                      {pk.items.map((it) => (
                        <li key={it} className="flex items-center gap-2 text-[13px] text-ceniza">
                          <span className="w-1 h-1 rounded-full bg-brasa flex-shrink-0" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-baseline gap-2 mt-3 pt-3 border-t border-borde/60">
                      <span className="display font-black text-2xl text-hueso">${pk.precio.toLocaleString('es-CL')}</span>
                      <span className="text-[13px] text-ceniza line-through">${pk.precioAntes.toLocaleString('es-CL')}</span>
                    </div>
                    <a
                      href={`https://wa.me/${WA}?text=Hola%2C+quiero+el+${encodeURIComponent(pk.nombre)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="display font-black text-[12px] tracking-[0.08em] bg-brasa text-carbon text-center px-4 py-3.5 rounded-xl hover:brightness-110 transition-all"
                    >
                      PEDIR POR WHATSAPP →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section className="bg-carbon py-12">
        <div className="mx-auto max-w-[1240px] px-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
          <div>
            {/* Aviso despacho */}
            <div className="bg-humo border border-borde rounded-xl px-5 py-4 mb-6 flex items-center gap-4 flex-wrap">
              <span className="display font-extrabold text-[10px] tracking-[0.12em] bg-brasa text-carbon px-3 py-1.5 rounded-lg">DESPACHO GRATIS</span>
              <span className="text-[14px] text-hueso/80">En compras sobre <strong className="text-brasa">$40.000</strong> dentro de Santiago.</span>
            </div>

            {esSuscriptor && (
              <div className="mb-6 rounded-xl border border-brasa/30 bg-brasa/10 px-5 py-4 text-[14px] text-hueso">
                Tu <strong className="text-brasa">5% de descuento de suscriptor</strong> se aplica al confirmar el pedido.
              </div>
            )}

            {/* Categorías */}
            <div className="flex gap-2 flex-wrap mb-7">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoria(c.id)}
                  className={`flex items-center gap-2 display font-bold text-[11px] tracking-[0.08em] px-3.5 py-2.5 rounded-xl border transition-all ${
                    categoria === c.id
                      ? 'bg-brasa text-carbon border-brasa'
                      : 'border-borde text-ceniza hover:border-brasa/50 hover:text-hueso'
                  }`}
                >
                  {c.icon && <img src={c.icon} alt={c.label} className="w-6 h-6 rounded-full object-cover" />}
                  {c.label.toUpperCase()}
                </button>
              ))}
            </div>

            {cargando && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-2xl bg-humo animate-pulse" />
                ))}
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-borde bg-humo px-5 py-4 text-[14px] text-ceniza">
                No pudimos cargar el catálogo. <a href={`https://wa.me/${WA}`} className="text-brasa underline">Pide por WhatsApp</a>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} onAgregar={agregar} />
              ))}
            </div>
          </div>

          <PanelCarrito />
        </div>
      </section>
    </>
  );
}
