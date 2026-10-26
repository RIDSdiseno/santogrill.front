import { useState } from 'react';
import { get, post, patch } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { api } from '../../services/api';

interface Banner { id: string; orden: number; src: string; alt: string; activo: boolean; }
interface GaleriaFoto { id: string; src: string; alt: string; orden: number; grande: boolean; activo: boolean; }

function ModalImagen({ titulo, inicial, onGuardar, onCerrar }: {
  titulo: string;
  inicial: { src?: string; alt?: string; grande?: boolean };
  onGuardar: (d: { src: string; alt: string; grande?: boolean }) => void;
  onCerrar: () => void;
}) {
  const [src, setSrc] = useState(inicial.src ?? '');
  const [alt, setAlt] = useState(inicial.alt ?? '');
  const [grande, setGrande] = useState(inicial.grande ?? false);
  const tieneGrande = 'grande' in inicial;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5">
      <div className="w-full max-w-lg bg-[#141312] border border-borde rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="display font-black text-lg text-hueso">{titulo}</div>
          <button onClick={onCerrar} className="text-ceniza hover:text-hueso text-2xl leading-none">×</button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">URL DE LA IMAGEN</span>
          <input
            type="url" value={src} onChange={(e) => setSrc(e.target.value)}
            placeholder="https://res.cloudinary.com/... o /images/foto.jpg"
            className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TEXTO ALTERNATIVO (ALT)</span>
          <input
            type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
            placeholder="Descripción de la imagen"
            className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[14px] focus:border-brasa outline-none"
          />
        </label>

        {tieneGrande && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={grande} onChange={(e) => setGrande(e.target.checked)} className="accent-[#f58220] w-4 h-4" />
            <span className="text-[14px] text-hueso/80">Foto grande (ocupa 2 filas en la galería)</span>
          </label>
        )}

        {src && (
          <div className="rounded-xl overflow-hidden h-36">
            <img src={src} alt={alt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}

        <div className="flex gap-3 mt-1">
          <button onClick={onCerrar} className="flex-1 display font-bold text-[12px] tracking-[0.08em] border border-borde text-ceniza rounded-xl py-3 hover:border-brasa hover:text-hueso">
            CANCELAR
          </button>
          <button
            onClick={() => { if (src.trim()) onGuardar({ src: src.trim(), alt: alt.trim(), ...(tieneGrande ? { grande } : {}) }); }}
            disabled={!src.trim()}
            className="flex-1 display font-black text-[12px] tracking-[0.08em] bg-brasa text-carbon rounded-xl py-3 hover:brightness-110 disabled:opacity-40"
          >
            GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
}

function SeccionBanners() {
  const { data, recargar: reload } = useFetch(() => get<Banner[]>('/banners'), []);
  const banners = data ?? [];
  const [modal, setModal] = useState<{ banner?: Banner } | null>(null);
  const [guardando, setGuardando] = useState<string | null>(null);

  async function toggleActivo(b: Banner) {
    setGuardando(b.id);
    await patch(`/banners/${b.id}`, { activo: !b.activo });
    reload();
    setGuardando(null);
  }

  async function eliminar(b: Banner) {
    if (!confirm(`¿Eliminar el banner "${b.alt}"?`)) return;
    await api(`/banners/${b.id}`, { method: 'DELETE' });
    reload();
  }

  async function guardar(d: { src: string; alt: string }) {
    if (modal?.banner) {
      await patch(`/banners/${modal.banner.id}`, d);
    } else {
      await post('/banners', { ...d, orden: banners.length + 1 });
    }
    setModal(null);
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="display font-black text-lg text-hueso">Banners del Hero</div>
          <p className="text-[13px] text-ceniza mt-0.5">Las imágenes del slider principal en la página de eventos.</p>
        </div>
        <button onClick={() => setModal({})} className="display font-black text-[11px] tracking-[0.08em] bg-brasa text-carbon px-4 py-2.5 rounded-xl hover:brightness-110">
          + AGREGAR
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {banners.map((b, idx) => (
          <div key={b.id} className={`flex items-center gap-4 bg-[#0f0e0d] border rounded-xl px-4 py-3 transition-colors ${b.activo ? 'border-borde' : 'border-borde/30 opacity-50'}`}>
            <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-humo">
              <img src={b.src} alt={b.alt} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="display font-bold text-[13px] text-hueso truncate">{b.alt}</div>
              <div className="text-[11px] text-ceniza truncate mt-0.5">{b.src}</div>
              <div className="text-[11px] text-ceniza mt-0.5">Orden: {idx + 1}</div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleActivo(b)}
                disabled={guardando === b.id}
                className={`display font-bold text-[10px] tracking-[0.08em] px-3 py-1.5 rounded-lg border transition-colors ${b.activo ? 'border-green-600/50 text-green-400 hover:bg-green-600/10' : 'border-borde text-ceniza hover:border-brasa'}`}
              >
                {b.activo ? 'ACTIVO' : 'INACTIVO'}
              </button>
              <button onClick={() => setModal({ banner: b })} className="display font-bold text-[10px] tracking-[0.08em] border border-borde text-ceniza px-3 py-1.5 rounded-lg hover:border-brasa hover:text-hueso">
                EDITAR
              </button>
              <button onClick={() => eliminar(b)} className="display font-bold text-[10px] tracking-[0.08em] border border-red-900/40 text-red-400/70 px-3 py-1.5 rounded-lg hover:border-red-600 hover:text-red-400">
                ×
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-8 text-ceniza text-[14px]">No hay banners. Agrega el primero.</div>
        )}
      </div>

      {modal !== null && (
        <ModalImagen
          titulo={modal.banner ? 'Editar banner' : 'Agregar banner'}
          inicial={{ src: modal.banner?.src, alt: modal.banner?.alt }}
          onGuardar={guardar}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  );
}

function SeccionGaleria() {
  const { data, recargar: reload } = useFetch(() => get<GaleriaFoto[]>('/galeria'), []);
  const fotos = data ?? [];
  const [modal, setModal] = useState<{ foto?: GaleriaFoto } | null>(null);
  const [guardando, setGuardando] = useState<string | null>(null);

  async function toggleActivo(f: GaleriaFoto) {
    setGuardando(f.id);
    await patch(`/galeria/${f.id}`, { activo: !f.activo });
    reload();
    setGuardando(null);
  }

  async function eliminar(f: GaleriaFoto) {
    if (!confirm(`¿Eliminar la foto "${f.alt}"?`)) return;
    await api(`/galeria/${f.id}`, { method: 'DELETE' });
    reload();
  }

  async function guardar(d: { src: string; alt: string; grande?: boolean }) {
    if (modal?.foto) {
      await patch(`/galeria/${modal.foto.id}`, d);
    } else {
      await post('/galeria', { ...d, orden: fotos.length + 1 });
    }
    setModal(null);
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="display font-black text-lg text-hueso">Galería de Fotos</div>
          <p className="text-[13px] text-ceniza mt-0.5">Las fotos que aparecen en la sección "Galería" de la página principal.</p>
        </div>
        <button onClick={() => setModal({})} className="display font-black text-[11px] tracking-[0.08em] bg-brasa text-carbon px-4 py-2.5 rounded-xl hover:brightness-110">
          + AGREGAR FOTO
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {fotos.map((f) => (
          <div key={f.id} className={`group relative rounded-xl overflow-hidden aspect-square bg-humo border transition-colors ${f.activo ? 'border-borde' : 'border-borde/20 opacity-50'}`}>
            <img src={f.src} alt={f.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-carbon/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <div className="display font-bold text-[10px] text-center text-hueso">{f.alt}</div>
              {f.grande && <span className="display font-bold text-[9px] text-brasa">GRANDE</span>}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => toggleActivo(f)}
                  disabled={guardando === f.id}
                  className={`display font-bold text-[9px] tracking-[0.06em] px-2 py-1 rounded-md border ${f.activo ? 'border-green-600/50 text-green-400' : 'border-borde text-ceniza'}`}
                >
                  {f.activo ? '✓' : '○'}
                </button>
                <button onClick={() => setModal({ foto: f })} className="display font-bold text-[9px] tracking-[0.06em] px-2 py-1 rounded-md border border-borde text-ceniza hover:border-brasa">
                  ✎
                </button>
                <button onClick={() => eliminar(f)} className="display font-bold text-[9px] tracking-[0.06em] px-2 py-1 rounded-md border border-red-900/40 text-red-400/70 hover:border-red-600">
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
        {fotos.length === 0 && (
          <div className="col-span-full text-center py-8 text-ceniza text-[14px]">No hay fotos. Agrega la primera.</div>
        )}
      </div>

      {modal !== null && (
        <ModalImagen
          titulo={modal.foto ? 'Editar foto' : 'Agregar foto a la galería'}
          inicial={{ src: modal.foto?.src, alt: modal.foto?.alt, grande: modal.foto?.grande }}
          onGuardar={guardar}
          onCerrar={() => setModal(null)}
        />
      )}
    </div>
  );
}

type Tab = 'banners' | 'galeria';

export default function ContenidoPage() {
  const [tab, setTab] = useState<Tab>('banners');

  return (
    <div>
      <div className="mb-6">
        <h1 className="display font-black text-2xl text-hueso">Contenido del sitio</h1>
        <p className="text-ceniza text-[14px] mt-1">Gestiona los banners del hero y las fotos de la galería.</p>
      </div>

      <div className="flex gap-1 bg-[#0f0e0d] border border-borde rounded-xl p-1 mb-7 w-fit">
        {([['banners', 'Banners Hero'], ['galeria', 'Galería de fotos']] as [Tab, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`display font-bold text-[12px] tracking-[0.08em] px-5 py-2.5 rounded-lg transition-colors ${tab === id ? 'bg-brasa text-carbon' : 'text-ceniza hover:text-hueso'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'banners' && <SeccionBanners />}
      {tab === 'galeria' && <SeccionGaleria />}

      <div className="mt-10 p-5 rounded-xl border border-borde/40 bg-[#0f0e0d]">
        <div className="display font-black text-[12px] tracking-[0.08em] text-ceniza mb-2">💡 CÓMO AGREGAR IMÁGENES</div>
        <p className="text-[13px] text-ceniza/80 leading-relaxed">
          Puedes usar URLs de Cloudinary (<code className="text-brasa">https://res.cloudinary.com/...</code>), rutas locales (<code className="text-brasa">/images/foto.jpg</code>), o cualquier URL de imagen pública. Los cambios se aplican en el sitio de inmediato.
        </p>
      </div>
    </div>
  );
}
