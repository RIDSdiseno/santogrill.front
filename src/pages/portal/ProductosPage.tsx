import { useState } from 'react';
import { get, post, patch, api } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { clp } from '../../lib/formato';
import type { Producto } from '../../services/tipos';

const CATEGORIAS = ['pizzas', 'costillas', 'alitas', 'carnes', 'complementos', 'packs'];

const VACIO: Partial<Producto> = { nombre: '', slug: '', categoria: 'pizzas', precio: 0, descripcion: '', imagen: '', activo: true };

function slugify(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ModalProducto({ inicial, onGuardar, onCerrar }: {
  inicial: Partial<Producto>;
  onGuardar: (d: Partial<Producto>) => Promise<void>;
  onCerrar: () => void;
}) {
  const esNuevo = !inicial.id;
  const [form, setForm] = useState({ ...VACIO, ...inicial });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  function set(campo: string, valor: string | number | boolean) {
    setForm((f) => {
      const next = { ...f, [campo]: valor };
      if (campo === 'nombre' && esNuevo) next.slug = slugify(String(valor));
      return next;
    });
  }

  async function enviar() {
    if (!form.nombre?.trim() || !form.slug?.trim() || !form.categoria || form.precio === undefined) {
      setError('Nombre, slug, categoría y precio son obligatorios');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
      onCerrar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#141312] border border-borde rounded-2xl p-6 flex flex-col gap-4 my-auto">
        <div className="flex items-center justify-between">
          <div className="display font-black text-lg text-hueso">{esNuevo ? 'Agregar producto' : 'Editar producto'}</div>
          <button onClick={onCerrar} className="text-ceniza hover:text-hueso text-2xl leading-none">×</button>
        </div>

        {error && <p className="text-red-400 text-[13px]">{error}</p>}

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 flex flex-col gap-1.5">
            <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">NOMBRE *</span>
            <input value={form.nombre ?? ''} onChange={(e) => set('nombre', e.target.value)}
              className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">SLUG *</span>
            <input value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)}
              className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none font-mono text-[12px]" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">CATEGORÍA *</span>
            <select value={form.categoria ?? ''} onChange={(e) => set('categoria', e.target.value)}
              className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none">
              {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">PRECIO CLP *</span>
            <input type="number" value={form.precio ?? 0} onChange={(e) => set('precio', Number(e.target.value))}
              className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none" />
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer pt-5">
            <input type="checkbox" checked={form.activo ?? true} onChange={(e) => set('activo', e.target.checked)} className="accent-[#f58220] w-4 h-4" />
            <span className="text-[14px] text-hueso/80">Activo (visible en tienda)</span>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">DESCRIPCIÓN</span>
          <textarea value={form.descripcion ?? ''} onChange={(e) => set('descripcion', e.target.value)} rows={2}
            className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none resize-none" />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">URL DE IMAGEN</span>
          <input value={form.imagen ?? ''} onChange={(e) => set('imagen', e.target.value)}
            placeholder="/images/foto.jpg o https://res.cloudinary.com/..."
            className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none" />
        </label>

        {form.imagen && (
          <div className="rounded-xl overflow-hidden h-32">
            <img src={form.imagen} alt={form.nombre} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}

        <div className="flex gap-3 mt-1">
          <button onClick={onCerrar} className="flex-1 display font-bold text-[12px] tracking-[0.08em] border border-borde text-ceniza rounded-xl py-3 hover:border-brasa hover:text-hueso">
            CANCELAR
          </button>
          <button onClick={enviar} disabled={guardando}
            className="flex-1 display font-black text-[12px] tracking-[0.08em] bg-brasa text-carbon rounded-xl py-3 hover:brightness-110 disabled:opacity-40">
            {guardando ? 'GUARDANDO…' : 'GUARDAR'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  const { data, recargar } = useFetch(() => get<Producto[]>('/productos?todos=1'), []);
  const productos = data ?? [];
  const [modal, setModal] = useState<Partial<Producto> | null>(null);
  const [filtroCat, setFiltroCat] = useState('');

  const filtrados = filtroCat ? productos.filter((p) => p.categoria === filtroCat) : productos;

  async function guardar(form: Partial<Producto>) {
    if (form.id) {
      const { id, ...data } = form;
      await patch(`/productos/${id}`, data);
    } else {
      await post('/productos', form);
    }
    recargar();
  }

  async function toggleActivo(p: Producto) {
    await patch(`/productos/${p.id}`, { activo: !p.activo });
    recargar();
  }

  async function eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    await api(`/productos/${p.id}`, { method: 'DELETE' });
    recargar();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="display font-black text-2xl text-hueso">Productos</h1>
          <p className="text-ceniza text-[14px] mt-1">Gestiona el catálogo de la tienda. Solo ADMIN puede crear, editar o eliminar.</p>
        </div>
        <button onClick={() => setModal(VACIO)}
          className="display font-black text-[11px] tracking-[0.08em] bg-brasa text-carbon px-4 py-2.5 rounded-xl hover:brightness-110 whitespace-nowrap">
          + AGREGAR
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFiltroCat('')}
          className={`display font-bold text-[11px] tracking-[0.08em] px-3.5 py-1.5 rounded-lg border transition-colors ${!filtroCat ? 'bg-brasa text-carbon border-brasa' : 'border-borde text-ceniza hover:text-hueso'}`}>
          TODAS
        </button>
        {CATEGORIAS.map((c) => (
          <button key={c} onClick={() => setFiltroCat(c)}
            className={`display font-bold text-[11px] tracking-[0.08em] px-3.5 py-1.5 rounded-lg border transition-colors ${filtroCat === c ? 'bg-brasa text-carbon border-brasa' : 'border-borde text-ceniza hover:text-hueso'}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrados.map((p) => (
          <div key={p.id} className={`bg-[#0f0e0d] border rounded-xl overflow-hidden transition-opacity ${p.activo ? 'border-borde' : 'border-borde/30 opacity-60'}`}>
            <div className="h-36 bg-humo relative">
              {p.imagen
                ? <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-ceniza text-[12px]">Sin imagen</div>
              }
              {!p.activo && (
                <div className="absolute inset-0 flex items-center justify-center bg-carbon/60">
                  <span className="display font-black text-[10px] tracking-[0.12em] text-ceniza bg-carbon/80 px-2 py-1 rounded">INACTIVO</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="display font-bold text-[10px] tracking-[0.12em] text-brasa mb-1">{p.categoria.toUpperCase()}</div>
              <div className="display font-black text-[14px] text-hueso leading-tight mb-1">{p.nombre}</div>
              {p.descripcion && <p className="text-[12px] text-ceniza leading-relaxed mb-2 line-clamp-2">{p.descripcion}</p>}
              <div className="display font-black text-[16px] text-hueso mb-3">{clp(p.precio)}</div>
              <div className="flex gap-2">
                <button onClick={() => toggleActivo(p)}
                  className={`flex-1 display font-bold text-[10px] tracking-[0.08em] py-2 rounded-lg border transition-colors ${p.activo ? 'border-green-600/50 text-green-400 hover:bg-green-600/10' : 'border-borde text-ceniza hover:border-brasa hover:text-hueso'}`}>
                  {p.activo ? 'ACTIVO' : 'INACTIVO'}
                </button>
                <button onClick={() => setModal(p)}
                  className="flex-1 display font-bold text-[10px] tracking-[0.08em] py-2 rounded-lg border border-borde text-ceniza hover:border-brasa hover:text-hueso">
                  EDITAR
                </button>
                <button onClick={() => eliminar(p)}
                  className="px-3 display font-bold text-[10px] rounded-lg border border-red-900/40 text-red-400/70 hover:border-red-600 hover:text-red-400">
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full text-center py-12 text-ceniza text-[14px]">No hay productos en esta categoría.</div>
        )}
      </div>

      {modal !== null && (
        <ModalProducto inicial={modal} onGuardar={guardar} onCerrar={() => setModal(null)} />
      )}
    </div>
  );
}
