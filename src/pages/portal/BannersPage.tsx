import { useState } from 'react';
import { get, post, patch, del } from '../../services/api';
import { useFetch } from '../../lib/useFetch';

interface Banner {
  id: string;
  seccion: 'tienda' | 'eventos' | 'general';
  orden: number;
  src: string;
  alt: string;
  titulo?: string;
  subtitulo?: string;
  activo: boolean;
  creadoEn: string;
}

const SECCIONES = [
  { id: 'todas', label: 'Todos' },
  { id: 'tienda', label: 'Tienda Online' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'general', label: 'General' },
];

const SECCION_LABELS: Record<string, string> = {
  tienda: 'Tienda Online',
  eventos: 'Eventos',
  general: 'General',
};

const vacio = (): Omit<Banner, 'id' | 'creadoEn'> => ({
  seccion: 'tienda',
  orden: 1,
  src: '',
  alt: '',
  titulo: '',
  subtitulo: '',
  activo: true,
});

export default function BannersPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Banner[]>('/banners?todos=1'), []);
  const [filtro, setFiltro] = useState('todas');
  const [modal, setModal] = useState<null | 'nuevo' | Banner>(null);
  const [form, setForm] = useState(vacio());
  const [guardando, setGuardando] = useState(false);
  const [errForm, setErrForm] = useState('');
  const [eliminando, setEliminando] = useState<string | null>(null);

  const banners = (data ?? []).filter((b) => filtro === 'todas' || b.seccion === filtro);

  function abrirNuevo() {
    setForm(vacio());
    setErrForm('');
    setModal('nuevo');
  }

  function abrirEditar(b: Banner) {
    setForm({ seccion: b.seccion, orden: b.orden, src: b.src, alt: b.alt, titulo: b.titulo ?? '', subtitulo: b.subtitulo ?? '', activo: b.activo });
    setErrForm('');
    setModal(b);
  }

  async function guardar() {
    if (!form.src || !form.alt) { setErrForm('URL de imagen y texto alternativo son obligatorios'); return; }
    setGuardando(true); setErrForm('');
    try {
      const payload = { ...form, titulo: form.titulo || undefined, subtitulo: form.subtitulo || undefined };
      if (modal === 'nuevo') {
        await post('/banners', payload);
      } else {
        await patch(`/banners/${(modal as Banner).id}`, payload);
      }
      setModal(null);
      recargar();
    } catch (e) {
      setErrForm(e instanceof Error ? e.message : 'Error al guardar');
    } finally { setGuardando(false); }
  }

  async function toggleActivo(b: Banner) {
    try { await patch(`/banners/${b.id}`, { activo: !b.activo }); recargar(); } catch { /* ignore */ }
  }

  async function eliminar(b: Banner) {
    if (!confirm(`¿Eliminar el banner "${b.alt}"?`)) return;
    setEliminando(b.id);
    try { await del(`/banners/${b.id}`); recargar(); } catch { /* ignore */ } finally { setEliminando(null); }
  }

  const inputCls = "w-full bg-carbon border border-borde rounded-lg px-3.5 py-2.5 text-hueso text-[14px] focus:border-brasa focus:outline-none placeholder:text-ceniza/50";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="display font-black text-2xl text-hueso">Banners</h1>
          <p className="text-ceniza text-[13px] mt-0.5">Imágenes de fondo de cada sección del sitio</p>
        </div>
        <button onClick={abrirNuevo} className="bg-brasa text-carbon display font-black text-[12px] tracking-[0.08em] px-5 py-2.5 rounded-xl hover:brightness-110 transition-all">
          + AGREGAR BANNER
        </button>
      </div>

      {/* Tabs sección */}
      <div className="flex gap-2 flex-wrap mb-6">
        {SECCIONES.map((s) => (
          <button key={s.id} onClick={() => setFiltro(s.id)}
            className={`display font-bold text-[11px] tracking-[0.08em] px-4 py-2 rounded-xl border transition-all ${filtro === s.id ? 'bg-brasa text-carbon border-brasa' : 'border-borde text-ceniza hover:border-brasa/50 hover:text-hueso'}`}>
            {s.label.toUpperCase()}
          </button>
        ))}
      </div>

      {cargando && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 rounded-xl bg-humo animate-pulse" />)}</div>}
      {error && <p className="text-ceniza bg-humo rounded-xl p-4 text-[14px]">Error al cargar banners.</p>}

      {!cargando && !error && banners.length === 0 && (
        <div className="text-center py-16 text-ceniza">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-[14px]">No hay banners en esta sección.</p>
          <button onClick={abrirNuevo} className="mt-4 text-brasa text-[13px] underline">Agregar el primero</button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {banners.map((b) => (
          <div key={b.id} className={`rounded-xl overflow-hidden border transition-colors ${b.activo ? 'border-borde/50' : 'border-borde/20 opacity-60'}`}>
            <div className="relative h-36 bg-carbon overflow-hidden">
              <img src={b.src} alt={b.alt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 to-transparent" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className="bg-carbon/80 text-brasa display font-bold text-[10px] tracking-[0.1em] px-2 py-1 rounded-md">
                  {SECCION_LABELS[b.seccion] ?? b.seccion}
                </span>
                <span className="bg-carbon/80 text-ceniza display font-bold text-[10px] px-2 py-1 rounded-md">#{b.orden}</span>
              </div>
              {b.titulo && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-hueso display font-black text-[13px] leading-tight drop-shadow">{b.titulo}</div>
                  {b.subtitulo && <div className="text-hueso/70 text-[11px] mt-0.5 drop-shadow">{b.subtitulo}</div>}
                </div>
              )}
            </div>
            <div className="bg-humo px-4 py-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13px] text-hueso truncate">{b.alt}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => toggleActivo(b)}
                  className={`display font-bold text-[10px] tracking-[0.06em] px-2.5 py-1.5 rounded-lg border transition-colors ${b.activo ? 'border-green-700 text-green-400 hover:bg-green-950' : 'border-borde text-ceniza hover:border-brasa hover:text-hueso'}`}>
                  {b.activo ? 'ACTIVO' : 'INACTIVO'}
                </button>
                <button onClick={() => abrirEditar(b)}
                  className="display font-bold text-[10px] tracking-[0.06em] px-2.5 py-1.5 rounded-lg border border-borde text-ceniza hover:border-brasa hover:text-hueso transition-colors">
                  EDITAR
                </button>
                <button onClick={() => eliminar(b)} disabled={eliminando === b.id}
                  className="w-7 h-7 rounded-lg border border-borde text-ceniza hover:border-red-700 hover:text-red-400 flex items-center justify-center transition-colors text-base disabled:opacity-30">
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="bg-humo border border-borde rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-carbon border-b border-borde px-6 py-4 flex items-center justify-between">
              <span className="display font-black text-[13px] tracking-[0.08em] text-hueso">{modal === 'nuevo' ? 'NUEVO BANNER' : 'EDITAR BANNER'}</span>
              <button onClick={() => setModal(null)} className="text-ceniza hover:text-hueso text-xl leading-none">×</button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              {/* Preview */}
              {form.src && (
                <div className="relative h-32 rounded-xl overflow-hidden bg-carbon">
                  <img src={form.src} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon/60 to-transparent" />
                  {form.titulo && <div className="absolute bottom-2 left-3 text-hueso display font-black text-[13px] drop-shadow">{form.titulo}</div>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">SECCIÓN</label>
                  <select value={form.seccion} onChange={(e) => setForm((s) => ({ ...s, seccion: e.target.value as Banner['seccion'] }))} className={inputCls}>
                    <option value="tienda">Tienda Online</option>
                    <option value="eventos">Eventos</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">ORDEN</label>
                  <input type="number" min={1} value={form.orden} onChange={(e) => setForm((s) => ({ ...s, orden: Number(e.target.value) }))} className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">URL DE IMAGEN *</label>
                <input value={form.src} onChange={(e) => setForm((s) => ({ ...s, src: e.target.value }))} placeholder="https://res.cloudinary.com/..." className={inputCls} />
                <p className="text-ceniza text-[11px] mt-0.5">Usa Cloudinary o cualquier URL de imagen pública</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TEXTO ALTERNATIVO *</label>
                <input value={form.alt} onChange={(e) => setForm((s) => ({ ...s, alt: e.target.value }))} placeholder="Descripción de la imagen" className={inputCls} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TÍTULO (opcional)</label>
                <input value={form.titulo} onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))} placeholder="A FUEGO LENTO, COMO DEBE SER" className={inputCls} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">SUBTÍTULO (opcional)</label>
                <input value={form.subtitulo} onChange={(e) => setForm((s) => ({ ...s, subtitulo: e.target.value }))} placeholder="Desde 10 personas, en Santiago y alrededores." className={inputCls} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm((s) => ({ ...s, activo: e.target.checked }))} className="sr-only" />
                  <div className={`w-10 h-5 rounded-full transition-colors ${form.activo ? 'bg-brasa' : 'bg-borde'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.activo ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-[13px] text-hueso">Activo (visible en el sitio)</span>
              </label>

              {errForm && <p className="text-red-400 text-[13px] bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">{errForm}</p>}
            </div>

            <div className="px-6 py-4 border-t border-borde flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 border border-borde text-ceniza display font-black text-[12px] tracking-[0.08em] py-3 rounded-xl hover:border-brasa hover:text-hueso transition-colors">
                CANCELAR
              </button>
              <button onClick={guardar} disabled={guardando} className="flex-1 bg-brasa text-carbon display font-black text-[12px] tracking-[0.08em] py-3 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all">
                {guardando ? 'GUARDANDO…' : 'GUARDAR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
