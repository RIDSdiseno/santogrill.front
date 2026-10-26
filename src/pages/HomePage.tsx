import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../services/api';
import { Boton } from '../components/Boton';
import { AreaTexto, Campo } from '../components/Campo';

const SERVICIOS = ['Hamburguesas', 'Parrilla y asados', 'Evento corporativo', 'Celebración privada', 'Mixto / a definir'];

const CL = 'https://res.cloudinary.com/dvqpmttci/image/upload';
const CROP = 'f_auto,q_auto,c_crop,w_1456,h_620,g_north';
const SLIDES = [
  { src: `${CL}/${CROP}/v1791896411/sto2_xpwa3n.png`, alt: 'Fuego, sabor y experiencia en tu evento' },
  { src: `${CL}/${CROP}/v1791896411/sto3_fc4tnu.png`, alt: 'Pizzas artesanales' },
  { src: `${CL}/${CROP}/v1791896418/sto4_ttsqvq.png`, alt: 'Carnes y costillas al fuego' },
  { src: `${CL}/${CROP}/v1791896418/sto5_rmqqrd.png`, alt: 'Catering para eventos' },
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
  { src: '/images/ev-g12-parrilla-humo.jpg', alt: 'Parrilla al humo', grande: false },
  { src: '/images/ev-g13-asador.jpg', alt: 'Asado al asador', grande: false },
  { src: '/images/ev-g14-jardin.jpg', alt: 'Montaje en jardín', grande: false },
];

const CATEGORIAS_EVENTO = [
  { src: '/images/ev-cat1-hamburguesa.jpg', titulo: 'Hamburguesas', desc: 'Smash burgers, gourmet y papas al carbón.' },
  { src: '/images/ev-cat2-carnes.jpg', titulo: 'Parrilla & Asados', desc: 'Carnes, costillar y la experiencia parrillera.' },
  { src: '/images/ev-cat3-corporativo.jpg', titulo: 'Eventos Corporativos', desc: 'Una experiencia diferente para tu equipo.' },
  { src: '/images/ev-cat4-celebracion.jpg', titulo: 'Celebraciones Privadas', desc: 'Cumpleaños, matrimonios, reuniones y más.' },
];

const PASOS = [
  { n: '01', titulo: 'Cuéntanos tu evento', desc: 'Fecha, lugar, cantidad de invitados y tipo de celebración.' },
  { n: '02', titulo: 'Diseñamos la propuesta', desc: 'Menú, formato, servicio y todos los detalles personalizados.' },
  { n: '03', titulo: 'Montamos y cocinamos', desc: 'Llegamos, instalamos y preparamos todo con nuestro equipo.' },
  { n: '04', titulo: 'Tú disfrutas', desc: 'Solo preocúpate de compartir. El resto es con nosotros.' },
];

const BADGES = [
  { titulo: 'Respuesta por WhatsApp', desc: 'Rápida y directa' },
  { titulo: 'Propuestas personalizadas', desc: 'Según tu evento y necesidades' },
  { titulo: 'Eventos desde 10 personas', desc: 'Tamaño ideal para compartir' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [evento, setEvento] = useState({ nombre: '', email: '', telefono: '', fechaEvento: '', lugar: '', personas: '', servicio: SERVICIOS[1]!, detalle: '' });
  const [mensaje, setMensaje] = useState({ nombre: '', email: '', texto: '' });
  const [estado, setEstado] = useState<{ evento?: string; mensaje?: string }>({});

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  async function enviarEvento(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post('/eventos', {
        ...evento,
        email: evento.email || undefined,
        telefono: evento.telefono || undefined,
        fechaEvento: evento.fechaEvento || undefined,
        lugar: evento.lugar || undefined,
        personas: evento.personas || undefined,
        detalle: evento.detalle || undefined
      });
      setEstado((s) => ({ ...s, evento: 'ok' }));
    } catch (err) {
      setEstado((s) => ({ ...s, evento: err instanceof Error ? err.message : 'Error' }));
    }
  }

  async function enviarMensaje(e: React.FormEvent) {
    e.preventDefault();
    try {
      await post('/mensajes', mensaje);
      setEstado((s) => ({ ...s, mensaje: 'ok' }));
    } catch (err) {
      setEstado((s) => ({ ...s, mensaje: err instanceof Error ? err.message : 'Error' }));
    }
  }

  return (
    <>
      {/* ── Hero Slider ── */}
      <section className="relative bg-carbon overflow-hidden" style={{ height: 'min(92vh, 660px)', minHeight: 480 }}>
        {SLIDES.map((s, i) => (
          <img
            key={s.src} src={s.src} alt={s.alt}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.2) 50%, transparent 100%)' }} />
        {/* CTAs row */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-16 pb-8">
          <div className="mx-auto w-full max-w-[1240px] flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <a href="#cotiza"><Boton>COTIZAR MI EVENTO</Boton></a>
              <Link to="/agenda"><Boton variante="secundario">RESERVAR FECHA →</Boton></Link>
            </div>
            <div className="flex gap-2 items-center">
              {SLIDES.map((_, i) => (
                <button
                  key={i} onClick={() => setSlide(i)}
                  className={`rounded-full transition-all duration-300 ${i === slide ? 'w-8 h-1.5 bg-brasa' : 'w-2 h-2 bg-hueso/30 hover:bg-hueso/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="bg-humo border-b border-borde/40">
        <div className="mx-auto max-w-[1240px] px-6 py-5 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-borde/40">
          {BADGES.map((b) => (
            <div key={b.titulo} className="flex items-center gap-3 py-3 sm:py-2 sm:px-6 first:pl-0 last:pr-0">
              <div className="w-2 h-2 rounded-full bg-brasa flex-shrink-0" />
              <div>
                <div className="display font-black text-[13px] text-hueso">{b.titulo}</div>
                <div className="text-[12px] text-ceniza">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Nuestros Servicios ── */}
      <section className="bg-humo py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-12">
            <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Lo que hacemos</p>
            <h2 className="display font-black text-4xl sm:text-5xl text-hueso mt-1 leading-tight">
              HACEMOS EVENTOS<br />
              <span className="text-brasa">QUE SE RECUERDAN</span>
            </h2>
            <div className="w-48 h-1 bg-brasa mt-3" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIAS_EVENTO.map((c) => (
              <a
                key={c.titulo} href="#cotiza"
                className="group relative block rounded-2xl overflow-hidden aspect-[4/5]"
              >
                <img
                  src={c.src} alt={c.titulo}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/30 to-transparent group-hover:from-carbon/95 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-6 h-0.5 bg-brasa mb-2 group-hover:w-12 transition-all duration-300" />
                  <div className="display font-black text-[15px] text-hueso leading-tight">{c.titulo}</div>
                  <p className="text-[12px] text-ceniza mt-1 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300">{c.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section className="relative bg-carbon py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src="/images/ev-bg-fuego.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1240px] px-6">
          <div className="mb-14 text-center">
            <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Simple y sin stress</p>
            <h2 className="display font-black text-4xl sm:text-5xl text-hueso mt-1">
              TÚ INVITAS.<br className="sm:hidden" /> <span className="text-brasa">NOSOTROS HACEMOS</span> EL RESTO.
            </h2>
          </div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Connecting line */}
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-brasa/20 hidden lg:block" />
            {PASOS.map((paso) => (
              <div key={paso.n} className="relative flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full border-2 border-brasa/40 flex items-center justify-center flex-shrink-0 bg-carbon">
                    <span className="display font-black text-xl text-brasa">{paso.n}</span>
                  </div>
                  <div className="h-px flex-1 bg-borde/40 lg:hidden" />
                </div>
                <div className="display font-black text-lg text-hueso">{paso.titulo}</div>
                <p className="text-[14px] text-ceniza leading-relaxed mt-2">{paso.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <a href="#cotiza" className="inline-flex items-center gap-3 bg-brasa text-carbon display font-black text-[13px] tracking-[0.1em] px-10 py-4 rounded-xl hover:brightness-110 transition-all">
              COTIZAR MI EVENTO →
            </a>
          </div>
        </div>
      </section>

      {/* ── Galería ── */}
      <section id="galeria" className="bg-humo py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Momentos reales</p>
              <h2 className="display font-black text-4xl text-hueso mt-1">GALERÍA</h2>
              <div className="w-28 h-1 bg-brasa mt-2" />
            </div>
            <a href="https://instagram.com/santogrill.cl" target="_blank" rel="noopener noreferrer"
              className="display font-bold text-[11px] tracking-[0.1em] text-ceniza border border-borde rounded-xl px-5 py-3 hover:border-brasa hover:text-hueso transition-colors">
              VER MÁS EN @SANTOGRILL.CL →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
            {GALERIA.map((g) => (
              <div
                key={g.src}
                className={`group relative rounded-2xl overflow-hidden ${g.grande ? 'row-span-2' : ''}`}
              >
                <img
                  src={g.src} alt={g.alt} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="display font-black text-[11px] tracking-[0.08em] text-hueso">{g.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formulario cotización ── */}
      <section id="cotiza" className="relative bg-carbon py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src="/images/ev-bg-fuego.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1240px] px-6 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>¿Listo para tu evento?</p>
            <h2 className="display font-black text-4xl text-hueso mt-1 leading-tight">
              COTIZA TU <span className="text-brasa">EVENTO</span>
            </h2>
            <div className="w-40 h-1 bg-brasa mt-3 mb-6" />
            <p className="text-hueso/65 max-w-md leading-relaxed">
              Cuéntanos fecha, lugar y número de invitados. Tu solicitud entra directo a nuestro sistema y te respondemos con una propuesta personalizada.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: '⚡', label: 'Respuesta en el día' },
                { icon: '📍', label: 'Santiago y alrededores' },
                { icon: '👥', label: 'Desde 10 personas' },
                { icon: '🍖', label: 'Parrilla profesional' },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 bg-humo/50 border border-borde/60 rounded-xl px-4 py-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="display font-bold text-[12px] text-hueso/80">{f.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden">
              <img src="/images/ev-cat3-corporativo.jpg" alt="Evento corporativo" className="w-full h-52 object-cover" />
            </div>
          </div>

          {estado.evento === 'ok' ? (
            <div className="bg-humo border border-brasa/50 rounded-2xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <div className="display font-black text-2xl text-brasa">¡Solicitud recibida!</div>
              <p className="mt-3 text-hueso/70 leading-relaxed">Te contactaremos con la propuesta dentro del día hábil siguiente. Si necesitas respuesta urgente, escríbenos por WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={enviarEvento} className="bg-humo border border-borde rounded-2xl p-7 flex flex-col gap-4">
              <Campo etiqueta="Nombre" required value={evento.nombre} onChange={(e) => setEvento({ ...evento, nombre: e.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo etiqueta="Correo" type="email" value={evento.email} onChange={(e) => setEvento({ ...evento, email: e.target.value })} />
                <Campo etiqueta="WhatsApp" value={evento.telefono} onChange={(e) => setEvento({ ...evento, telefono: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo etiqueta="Fecha del evento" type="date" value={evento.fechaEvento} onChange={(e) => setEvento({ ...evento, fechaEvento: e.target.value })} />
                <Campo etiqueta="N° invitados" type="number" min={1} value={evento.personas} onChange={(e) => setEvento({ ...evento, personas: e.target.value })} />
              </div>
              <Campo etiqueta="Lugar" value={evento.lugar} onChange={(e) => setEvento({ ...evento, lugar: e.target.value })} />
              <label className="flex flex-col gap-1.5">
                <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TIPO DE SERVICIO</span>
                <select
                  value={evento.servicio}
                  onChange={(e) => setEvento({ ...evento, servicio: e.target.value })}
                  className="w-full bg-carbon border border-borde rounded-xl px-3.5 py-3 text-hueso text-[15px] focus:border-brasa outline-none"
                >
                  {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <AreaTexto etiqueta="Cuéntanos más" rows={3} value={evento.detalle} onChange={(e) => setEvento({ ...evento, detalle: e.target.value })} />
              {estado.evento && estado.evento !== 'ok' && <p className="text-sm text-brasa">{estado.evento}</p>}
              <Boton type="submit">ENVIAR SOLICITUD</Boton>
            </form>
          )}
        </div>
      </section>

      {/* ── Contacto ── */}
      <section className="bg-humo py-20">
        <div className="mx-auto max-w-[1240px] px-6 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Estamos aquí</p>
            <h2 className="display font-black text-4xl text-hueso leading-tight">
              ¿TIENES UNA <span className="text-brasa">CONSULTA?</span>
            </h2>
            <div className="w-36 h-1 bg-brasa mt-3 mb-5" />
            <p className="text-hueso/65 max-w-md leading-relaxed">
              Escríbenos y te respondemos por correo. Tu mensaje queda registrado en nuestra plataforma interna para que no se pierda ninguno.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <a href="https://wa.me/56961213577" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-brasa/10 border border-brasa/20 flex items-center justify-center group-hover:bg-brasa/20 transition-colors">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <div className="display font-bold text-[12px] tracking-[0.08em] text-ceniza">WHATSAPP</div>
                  <div className="text-brasa text-[15px] font-semibold">+56 9 6121 3577</div>
                </div>
              </a>
              <a href="https://instagram.com/santogrill.cl" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-brasa/10 border border-brasa/20 flex items-center justify-center group-hover:bg-brasa/20 transition-colors">
                  <span className="text-lg">📷</span>
                </div>
                <div>
                  <div className="display font-bold text-[12px] tracking-[0.08em] text-ceniza">INSTAGRAM</div>
                  <div className="text-brasa text-[15px] font-semibold">@santogrill.cl</div>
                </div>
              </a>
            </div>
          </div>

          {estado.mensaje === 'ok' ? (
            <div className="bg-carbon border border-brasa/50 rounded-2xl p-8">
              <div className="text-4xl mb-3">✅</div>
              <div className="display font-black text-2xl text-brasa">¡Mensaje recibido!</div>
              <p className="mt-3 text-hueso/70 leading-relaxed">Te responderemos a tu correo dentro del día hábil siguiente.</p>
            </div>
          ) : (
            <form onSubmit={enviarMensaje} className="bg-carbon border border-borde rounded-2xl p-7 flex flex-col gap-4">
              <Campo placeholder="Tu nombre" required value={mensaje.nombre} onChange={(e) => setMensaje({ ...mensaje, nombre: e.target.value })} />
              <Campo placeholder="Tu correo electrónico" type="email" required value={mensaje.email} onChange={(e) => setMensaje({ ...mensaje, email: e.target.value })} />
              <AreaTexto placeholder="¿En qué te podemos ayudar?" rows={5} required value={mensaje.texto} onChange={(e) => setMensaje({ ...mensaje, texto: e.target.value })} />
              {estado.mensaje && estado.mensaje !== 'ok' && <p className="text-sm text-brasa">{estado.mensaje}</p>}
              <Boton type="submit">ENVIAR MENSAJE</Boton>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
