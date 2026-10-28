import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../services/api';

const CL = 'https://res.cloudinary.com/dvqpmttci/image/upload';
const CROP = 'f_auto,q_auto,c_crop,w_1456,h_620,g_north';
const SLIDES = [
  { src: `${CL}/${CROP}/v1791896411/sto2_xpwa3n.png`, label: 'ASADO AL PALO', titulo: 'A FUEGO LENTO,\nCOMO DEBE SER' },
  { src: `${CL}/${CROP}/v1791896411/sto3_fc4tnu.png`, label: 'PIZZAS ARTESANALES', titulo: 'MASA MADRE,\nSABOR REAL' },
  { src: `${CL}/${CROP}/v1791896418/sto4_ttsqvq.png`, label: 'PARRILLA & ASADOS', titulo: 'TU EVENTO,\nNUESTRO FUEGO' },
  { src: `${CL}/${CROP}/v1791896418/sto5_rmqqrd.png`, label: 'CATERING', titulo: 'DESDE 10\nPERSONAS' },
  { src: `${CL}/${CROP}/v1791896411/sto2_xpwa3n.png`, label: 'CELEBRACIONES', titulo: 'SANTIAGO\nY ALREDEDORES' },
];

const GALERIA = [
  { src: '/images/ev-g1-costillar.jpg', alt: 'Costillar BBQ', grande: true },
  { src: '/images/ev-g2-carne-fuego.jpg', alt: 'Carne al fuego', grande: true },
  { src: '/images/ev-g3-parrilla.jpg', alt: 'Parrilla completa', grande: true },
  { src: '/images/ev-g4-tabla-carnes.jpg', alt: 'Tabla de carnes', grande: false },
  { src: '/images/ev-g5-tabla-compartir.jpg', alt: 'Tabla para compartir', grande: false },
  { src: '/images/ev-g7-brasas.jpg', alt: 'Fuego y brasas', grande: false },
  { src: '/images/ev-g8-choripanes.jpg', alt: 'Choripanes y pollo', grande: false },
  { src: '/images/ev-g9-cortes.jpg', alt: 'Cortes y longanizas', grande: false },
  { src: '/images/ev-g11-carro.jpg', alt: 'Nuestro carro', grande: false },
];

const CATEGORIAS_EVENTO = [
  { src: '/images/ev-cat1-hamburguesa.jpg', titulo: 'HAMBURGUESAS', desc: 'Smash burgers, hamburguesas gourmet, papas y acompañamientos.' },
  { src: '/images/ev-cat2-carnes.jpg', titulo: 'PARRILLA & ASADOS', desc: 'Carnes, costillar, acompañamientos y la experiencia parrillera.' },
  { src: '/images/ev-cat3-corporativo.jpg', titulo: 'EVENTOS CORPORATIVOS', desc: 'Una experiencia gastronómica diferente para tu equipo y clientes.' },
  { src: '/images/ev-cat4-celebracion.jpg', titulo: 'CELEBRACIONES PRIVADAS', desc: 'Cumpleaños, matrimonios, reuniones y mucho más.' },
];

const PASOS = [
  { n: '01', titulo: 'Cuéntanos tu evento', desc: 'Fecha, lugar, cantidad de invitados y tipo de celebración.' },
  { n: '02', titulo: 'Diseñamos la propuesta', desc: 'Menú, formato, servicio y detalles personalizados.' },
  { n: '03', titulo: 'Montamos y cocinamos', desc: 'Llegamos, instalamos y preparamos todo con nuestro equipo.' },
  { n: '04', titulo: 'Tú disfrutas', desc: 'Nosotros nos encargamos para que solo te preocupes de compartir.' },
];

const SERVICIOS = ['Hamburguesas', 'Parrilla y asados', 'Evento corporativo', 'Celebración privada', 'Mixto / a definir'];
export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [evento, setEvento] = useState({ nombre: '', email: '', telefono: '', fechaEvento: '', lugar: '', personas: '', servicio: SERVICIOS[0]!, detalle: '' });
  const [mensaje, setMensaje] = useState({ nombre: '', email: '', texto: '' });
  const [estado, setEstado] = useState<{ evento?: string; mensaje?: string }>({});

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  async function enviarEvento(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post('/eventos', { ...evento, email: evento.email || undefined, telefono: evento.telefono || undefined, fechaEvento: evento.fechaEvento || undefined, lugar: evento.lugar || undefined, personas: evento.personas || undefined, detalle: evento.detalle || undefined });
      setEstado((s) => ({ ...s, evento: 'ok' }));
    } catch (err) { setEstado((s) => ({ ...s, evento: err instanceof Error ? err.message : 'Error' })); }
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post('/mensajes', mensaje);
      setEstado((s) => ({ ...s, mensaje: 'ok' }));
    } catch (err) { setEstado((s) => ({ ...s, mensaje: err instanceof Error ? err.message : 'Error' })); }
  }

  const inputCls = "w-full bg-humo border border-borde/60 rounded-lg px-4 py-3 text-hueso text-[14px] focus:border-brasa focus:outline-none placeholder:text-ceniza/60";

  return (
    <>
      {/* ── Hero Slider ── */}
      <section className="relative bg-carbon overflow-hidden" style={{ height: 'min(92vh, 680px)', minHeight: 520 }}>
        {SLIDES.map((s, i) => (
          <img key={s.src} src={s.src} alt={s.label}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0, filter: 'brightness(0.45)' }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 60%, transparent 100%)' }} />

        {/* Flechas */}
        <button onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-carbon/50 border border-borde/40 flex items-center justify-center text-hueso hover:bg-brasa hover:border-brasa transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-carbon/50 border border-borde/40 flex items-center justify-center text-hueso hover:bg-brasa hover:border-brasa transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Contenido */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-brasa" />
              <span className="display font-bold text-[11px] tracking-[0.2em] text-brasa">{SLIDES[slide]?.label}</span>
            </div>
            <h1 className="display font-black text-5xl sm:text-6xl md:text-7xl text-hueso leading-[1.0] mb-4 whitespace-pre-line">
              {SLIDES[slide]?.titulo}
            </h1>
            <p className="text-hueso/70 text-[15px] mb-6 max-w-sm">Desde 10 personas, en Santiago y alrededores.</p>
            <div className="flex flex-wrap gap-3">
              <a href="#cotiza" className="bg-brasa text-carbon display font-black text-[12px] tracking-[0.1em] px-7 py-3.5 rounded-lg hover:brightness-110 transition-all">
                COTIZAR EVENTO →
              </a>
              <Link to="/agenda" className="bg-carbon/60 border border-borde text-hueso display font-black text-[12px] tracking-[0.1em] px-7 py-3.5 rounded-lg hover:border-brasa transition-all">
                RESERVA TU FECHA
              </Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-8 h-1.5 bg-brasa' : 'w-2 h-2 bg-hueso/30 hover:bg-hueso/60'}`} />
          ))}
        </div>
      </section>

      {/* ── Hacemos Eventos ── */}
      <section className="bg-carbon py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3"><div className="w-8 h-0.5 bg-brasa" /></div>
            <h2 className="display font-black text-4xl sm:text-5xl text-hueso leading-tight">
              HACEMOS EVENTOS<br /><span className="text-brasa">QUE SE RECUERDAN</span>
            </h2>
            <p className="text-ceniza text-[15px] mt-4 max-w-lg">Desde una hamburguesa perfecta hasta un asado tradicional, llevamos la experiencia de la parrilla a tu evento, con productos de primera calidad, montaje profesional y todo el sabor de Santo Grill.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIAS_EVENTO.map((c) => (
              <a key={c.titulo} href="#cotiza" className="group block rounded-xl overflow-hidden bg-humo border border-borde/40 hover:border-brasa/50 transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.src} alt={c.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ filter: 'brightness(0.8)' }} />
                </div>
                <div className="p-4">
                  <div className="text-brasa display font-black text-[13px] tracking-[0.06em] mb-1">{c.titulo}</div>
                  <p className="text-ceniza text-[12px] leading-relaxed">{c.desc}</p>
                  <div className="mt-3 text-brasa text-[12px]">→</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="bg-humo py-20">
        <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-2 mb-4"><div className="w-8 h-0.5 bg-brasa" /></div>
            <h2 className="display font-black text-4xl sm:text-5xl text-carbon leading-tight">
              TÚ INVITA.<br />
              <span className="text-brasa">NOSOTROS HACEMOS<br />EL RESTO.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {PASOS.map((paso) => (
              <div key={paso.n} className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-full bg-brasa flex items-center justify-center flex-shrink-0">
                  <span className="display font-black text-[15px] text-carbon">{paso.n}</span>
                </div>
                <div className="display font-black text-[15px] text-carbon">{paso.titulo}</div>
                <p className="text-[13px] text-ceniza leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galería ── */}
      <section id="galeria" className="bg-carbon py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-brasa" />
              <h2 className="display font-black text-xl text-hueso tracking-[0.05em]">GALERÍA</h2>
            </div>
            <a href="https://instagram.com/santogrill.cl" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] display font-bold tracking-[0.08em] text-ceniza hover:text-brasa transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              VER MÁS EN @SANTOGRILL.CL →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 auto-rows-[160px] gap-2">
            {GALERIA.map((g) => (
              <div key={g.src} className={`relative rounded-lg overflow-hidden ${g.grande ? 'row-span-2 col-span-1 md:col-span-2' : ''}`}>
                <img src={g.src} alt={g.alt} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-brasa py-12 px-6">
        <div className="mx-auto max-w-[1240px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="display font-black text-3xl text-carbon leading-tight">¿TIENES UN EVENTO<br />EN MENTE?</h2>
          </div>
          <p className="text-carbon/80 text-[14px] max-w-xs">Cuéntanos fecha, lugar y cantidad de invitados y te contactamos por WhatsApp para armar tu propuesta.</p>
          <a href="#cotiza" className="bg-carbon text-hueso display font-black text-[12px] tracking-[0.1em] px-8 py-4 rounded-xl hover:bg-humo transition-colors whitespace-nowrap">
            ESCRÍBENOS AHORA →
          </a>
        </div>
      </section>

      {/* ── Formulario Cotización ── */}
      <section id="cotiza" className="bg-carbon py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="border border-borde/40 rounded-2xl p-8 bg-humo">
              <div className="flex items-center gap-2 mb-2"><div className="w-8 h-0.5 bg-brasa" /></div>
              <h2 className="display font-black text-4xl text-hueso leading-tight mb-2">
                COTIZA TU<br /><span className="text-brasa">EVENTO</span>
              </h2>
              <p className="text-ceniza text-[13px] mb-6 leading-relaxed">
                Completa los datos y enviamos tu solicitud directo a nuestro WhatsApp. Respondemos con la propuesta y el valor por persona.
              </p>
              <div className="space-y-2 text-[13px] text-ceniza">
                <p>WhatsApp: <span className="text-hueso">+56 9 6121 3577</span></p>
                <p>Instagram: <a href="https://instagram.com/santogrill.cl" className="text-brasa">@santogrill.cl</a></p>
                <p>Eventos en Santiago y alrededores</p>
              </div>
            </div>

            {estado.evento === 'ok' ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔥</div>
                  <div className="display font-black text-xl text-hueso">¡Recibimos tu solicitud!</div>
                  <p className="text-ceniza mt-2">Te contactamos pronto por WhatsApp.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={enviarEvento} className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">NOMBRE</label>
                  <input required value={evento.nombre} onChange={(e) => setEvento((s) => ({ ...s, nombre: e.target.value }))} placeholder="Tu nombre" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">FECHA</label>
                  <input type="date" value={evento.fechaEvento} onChange={(e) => setEvento((s) => ({ ...s, fechaEvento: e.target.value }))} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">LUGAR</label>
                  <input value={evento.lugar} onChange={(e) => setEvento((s) => ({ ...s, lugar: e.target.value }))} placeholder="Comuna o dirección" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">INVITADOS</label>
                  <input type="number" value={evento.personas} onChange={(e) => setEvento((s) => ({ ...s, personas: e.target.value }))} placeholder="30" className={inputCls} />
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TIPO DE SERVICIO</label>
                  <select value={evento.servicio} onChange={(e) => setEvento((s) => ({ ...s, servicio: e.target.value }))} className={inputCls}>
                    {SERVICIOS.map((sv) => <option key={sv} value={sv}>{sv}</option>)}
                  </select>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">DETALLES</label>
                  <textarea value={evento.detalle} onChange={(e) => setEvento((s) => ({ ...s, detalle: e.target.value }))} rows={3} placeholder="Cuéntanos qué tienes en mente" className={inputCls + ' resize-none'} />
                </div>
                {estado.evento && estado.evento !== 'ok' && <p className="col-span-2 text-red-400 text-[13px]">{estado.evento}</p>}
                <button type="submit" className="col-span-2 bg-brasa text-carbon display font-black text-[13px] tracking-[0.1em] py-4 rounded-xl hover:brightness-110 transition-all">
                  ENVIAR POR WHATSAPP →
                </button>
                <p className="col-span-2 text-ceniza text-[11px] text-center -mt-2">Se abrirá WhatsApp con tu solicitud lista para enviar.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Contacto ── */}
      <section className="bg-humo py-20">
        <div className="mx-auto max-w-[1240px] px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="display font-black text-4xl text-carbon leading-tight">
              ¿TIENES UNA <span className="text-brasa">CONSULTA?</span>
            </h2>
            <p className="text-ceniza text-[14px] mt-4 leading-relaxed max-w-sm">
              Escríbenos y te respondemos por correo. Tu mensaje queda registrado en nuestra plataforma interna, así no se pierde ninguno.
            </p>
          </div>
          {estado.mensaje === 'ok' ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-3">✅</div>
              <div className="display font-black text-lg text-carbon">Mensaje enviado</div>
              <p className="text-ceniza mt-1 text-[14px]">Te respondemos pronto.</p>
            </div>
          ) : (
            <form onSubmit={enviarMensaje} className="flex flex-col gap-3">
              <input required value={mensaje.nombre} onChange={(e) => setMensaje((s) => ({ ...s, nombre: e.target.value }))} placeholder="Tu nombre" className={inputCls + ' bg-white border-borde/30 text-carbon placeholder:text-ceniza'} />
              <input required type="email" value={mensaje.email} onChange={(e) => setMensaje((s) => ({ ...s, email: e.target.value }))} placeholder="Tu correo" className={inputCls + ' bg-white border-borde/30 text-carbon placeholder:text-ceniza'} />
              <textarea required value={mensaje.texto} onChange={(e) => setMensaje((s) => ({ ...s, texto: e.target.value }))} rows={4} placeholder="Cuéntanos en qué te ayudamos" className={inputCls + ' bg-white border-borde/30 text-carbon placeholder:text-ceniza resize-none'} />
              {estado.mensaje && estado.mensaje !== 'ok' && <p className="text-red-500 text-[13px]">{estado.mensaje}</p>}
              <button type="submit" className="bg-brasa text-carbon display font-black text-[13px] tracking-[0.1em] py-4 rounded-xl hover:brightness-110 transition-all">
                ENVIAR MENSAJE
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
