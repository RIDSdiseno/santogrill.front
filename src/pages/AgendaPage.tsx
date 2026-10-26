import { useState } from 'react';
import { post } from '../services/api';

const WA = '56961213577';

const TIPOS = [
  'Cotización de evento (visita o llamada)',
  'Evento confirmado con fecha',
  'Retiro de pedido en tienda',
  'Delivery con franja horaria',
];

const SERVICIOS = ['Parrilla y asados', 'Hamburguesas', 'Pizzas', 'Costillas BBQ', 'Mixto / a definir'];

const HORAS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
];

const DIAS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns 0=Mon … 6=Sun (ISO week)
function isoWeekday(d: Date) {
  return (d.getDay() + 6) % 7;
}

interface CalendarioProps {
  seleccionado: Date | null;
  onSeleccionar: (d: Date) => void;
}

function Calendario({ seleccionado, onSeleccionar }: CalendarioProps) {
  const hoy = new Date();
  const [viewYear, setViewYear] = useState(hoy.getFullYear());
  const [viewMonth, setViewMonth] = useState(hoy.getMonth());

  const primerDia = startOfMonth(viewYear, viewMonth);
  const totalDias = getDaysInMonth(viewYear, viewMonth);
  const offsetInicio = isoWeekday(primerDia); // blanks before day 1

  // Build grid: blanks + days
  const celdas: (number | null)[] = [
    ...Array(offsetInicio).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (celdas.length % 7 !== 0) celdas.push(null);

  function irMes(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m); setViewYear(y);
  }

  function isPasado(dia: number) {
    const d = new Date(viewYear, viewMonth, dia);
    d.setHours(23, 59, 59);
    return d < hoy;
  }

  function esFuturoCercano(dia: number) {
    const d = new Date(viewYear, viewMonth, dia);
    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() + 90);
    return d <= limite;
  }

  const puedeRetroceder = viewYear > hoy.getFullYear() || (viewYear === hoy.getFullYear() && viewMonth > hoy.getMonth());

  return (
    <div className="bg-humo border border-borde rounded-2xl overflow-hidden">
      {/* Header del mes */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-borde/60">
        <button
          onClick={() => irMes(-1)}
          disabled={!puedeRetroceder}
          className="w-9 h-9 rounded-xl border border-borde flex items-center justify-center text-ceniza hover:border-brasa hover:text-brasa disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
        <div className="display font-black text-[15px] text-hueso">
          {MESES_ES[viewMonth]} {viewYear}
        </div>
        <button
          onClick={() => irMes(1)}
          className="w-9 h-9 rounded-xl border border-borde flex items-center justify-center text-ceniza hover:border-brasa hover:text-brasa transition-colors"
        >
          ›
        </button>
      </div>

      {/* Cabecera días */}
      <div className="grid grid-cols-7 border-b border-borde/40">
        {DIAS_ES.map((d, i) => (
          <div key={d} className={`py-2.5 text-center display font-bold text-[10px] tracking-[0.1em] ${i >= 5 ? 'text-brasa/50' : 'text-ceniza'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid días */}
      <div className="grid grid-cols-7 p-3 gap-1">
        {celdas.map((dia, idx) => {
          if (!dia) return <div key={`blank-${idx}`} />;

          const fecha = new Date(viewYear, viewMonth, dia);
          const pasado = isPasado(dia);
          const disponible = !pasado && esFuturoCercano(dia);
          const esSel = seleccionado && isSameDay(fecha, seleccionado);
          const esHoy = isSameDay(fecha, hoy);
          const esFinde = isoWeekday(fecha) >= 5;

          return (
            <button
              key={dia}
              onClick={() => disponible && onSeleccionar(fecha)}
              disabled={!disponible}
              className={[
                'aspect-square rounded-xl display font-bold text-[14px] transition-all flex items-center justify-center relative',
                esSel ? 'bg-brasa text-carbon ring-2 ring-brasa/40 ring-offset-1 ring-offset-humo scale-110' :
                esHoy && !pasado ? 'border border-brasa/60 text-brasa hover:bg-brasa/10' :
                disponible ? (esFinde ? 'text-hueso/60 hover:bg-brasa/15 hover:text-hueso' : 'text-hueso hover:bg-brasa/15') :
                'text-ceniza/25 cursor-not-allowed',
              ].join(' ')}
            >
              {dia}
              {esHoy && !esSel && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brasa" />}
            </button>
          );
        })}
      </div>

      {seleccionado && (
        <div className="px-5 py-3 border-t border-borde/40 flex items-center justify-between">
          <span className="text-[13px] text-ceniza">Fecha seleccionada</span>
          <span className="display font-black text-[13px] text-brasa">
            {DIAS_ES[isoWeekday(seleccionado)]} {seleccionado.getDate()} {MESES_ES[seleccionado.getMonth()]} {seleccionado.getFullYear()}
          </span>
        </div>
      )}
    </div>
  );
}

function formatFechaLarga(d: Date) {
  return `${DIAS_ES[isoWeekday(d)]} ${d.getDate()} de ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
}

export default function AgendaPage() {
  const [tipo, setTipo] = useState('');
  const [fechaSel, setFechaSel] = useState<Date | null>(null);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [servicio, setServicio] = useState(SERVICIOS[0]!);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [reservado, setReservado] = useState(false);

  function seleccionarHora(h: string) {
    if (!horaInicio || (horaInicio && horaFin)) {
      setHoraInicio(h); setHoraFin('');
    } else {
      if (h > horaInicio) setHoraFin(h);
      else { setHoraInicio(h); setHoraFin(''); }
    }
  }

  function esEnRango(h: string) {
    return !!(horaInicio && horaFin && h >= horaInicio && h <= horaFin);
  }

  const rangoLabel = horaInicio ? (horaFin ? `${horaInicio} a ${horaFin} hrs` : `Desde ${horaInicio}`) : '—';
  const puedeReservar = tipo && fechaSel && horaInicio && horaFin && nombre.trim();

  function reservarWhatsApp() {
    if (!puedeReservar) return;
    const texto = `Hola Santo Grill, quiero agendar:\n\n📌 Tipo: ${tipo}\n📅 Fecha: ${formatFechaLarga(fechaSel!)}\n⏰ Horario: ${horaInicio} a ${horaFin} hrs\n🍖 Servicio: ${servicio}\n👤 Nombre: ${nombre}${telefono ? `\n📞 Teléfono: ${telefono}` : ''}`;
    // Guardar reserva en backend (fire-and-forget — no bloquea el WhatsApp)
    post('/reservas', {
      tipo, fecha: fechaSel!.toISOString(), horaInicio, horaFin,
      servicio: servicio || undefined, nombre, telefono: telefono || undefined,
    }).catch(() => {});
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(texto)}`, '_blank');
    setReservado(true);
  }

  if (reservado) {
    return (
      <section className="bg-carbon min-h-screen flex items-center justify-center py-20">
        <div className="mx-auto max-w-[520px] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brasa/10 border-2 border-brasa/40 flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
          <h2 className="display font-black text-4xl text-hueso">¡RESERVA TOMADA!</h2>
          <div className="w-20 h-1 bg-brasa mx-auto mt-3 mb-6" />
          <div className="bg-humo border border-borde rounded-2xl p-6 text-left space-y-3 mb-8">
            {[
              { label: 'Tipo', value: tipo },
              { label: 'Fecha', value: fechaSel ? formatFechaLarga(fechaSel) : '' },
              { label: 'Horario', value: rangoLabel },
              { label: 'Servicio', value: servicio },
              { label: 'Nombre', value: nombre },
            ].map((r) => (
              <div key={r.label} className="flex justify-between items-start gap-3">
                <span className="display font-bold text-[11px] tracking-[0.08em] text-ceniza">{r.label}</span>
                <span className="text-[14px] text-hueso text-right">{r.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setReservado(false); setTipo(''); setFechaSel(null); setHoraInicio(''); setHoraFin(''); setNombre(''); setTelefono(''); }}
            className="display font-black text-[12px] tracking-[0.1em] border border-borde text-hueso px-8 py-3.5 rounded-xl hover:border-brasa hover:text-brasa transition-colors"
          >
            AGENDAR OTRA HORA
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-humo border-b border-borde/60 py-14">
        <div className="mx-auto max-w-[1240px] px-6">
          <p className="text-brasa text-xl" style={{ fontFamily: 'var(--font-script)' }}>Elige el momento</p>
          <h1 className="display font-black text-5xl sm:text-6xl text-hueso mt-1 leading-[0.95]">
            AGENDA TU<br /><span className="text-brasa">SERVICIO</span>
          </h1>
          <div className="w-44 h-1 bg-brasa mt-4" />
          <p className="mt-4 max-w-xl text-hueso/65 leading-relaxed">
            Elige el tipo de servicio, el día y el rango de horas. Te confirmamos por WhatsApp con recordatorio el día anterior.
          </p>
        </div>
      </section>

      <section className="bg-carbon py-14">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">

            {/* Columna izquierda */}
            <div className="flex flex-col gap-8">

              {/* Paso 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-brasa text-carbon display font-black text-[13px] flex items-center justify-center flex-shrink-0">1</div>
                  <div className="display font-black text-[13px] tracking-[0.1em] text-hueso">TIPO DE AGENDAMIENTO</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {TIPOS.map((t) => (
                    <button
                      key={t} onClick={() => setTipo(t)}
                      className={`text-left px-4 py-4 rounded-xl border text-[14px] transition-all leading-snug ${tipo === t ? 'border-brasa bg-brasa/10 text-hueso ring-1 ring-brasa/30' : 'border-borde text-ceniza hover:border-brasa/40 hover:text-hueso'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 2 — Calendario */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-7 h-7 rounded-full display font-black text-[13px] flex items-center justify-center flex-shrink-0 transition-colors ${tipo ? 'bg-brasa text-carbon' : 'bg-borde text-ceniza'}`}>2</div>
                  <div className="display font-black text-[13px] tracking-[0.1em] text-hueso">ELIGE EL DÍA</div>
                </div>
                <Calendario seleccionado={fechaSel} onSeleccionar={setFechaSel} />
              </div>

              {/* Paso 3 — Horario */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-7 h-7 rounded-full display font-black text-[13px] flex items-center justify-center flex-shrink-0 transition-colors ${fechaSel ? 'bg-brasa text-carbon' : 'bg-borde text-ceniza'}`}>3</div>
                  <div className="display font-black text-[13px] tracking-[0.1em] text-hueso">HORARIO</div>
                </div>
                <p className="text-[12px] text-ceniza mb-3 ml-10">Toca la hora de inicio y luego la de término.</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {HORAS.map((h) => {
                    const esInicio = h === horaInicio;
                    const esFin = h === horaFin;
                    const enRango = esEnRango(h);
                    return (
                      <button
                        key={h} onClick={() => seleccionarHora(h)}
                        className={[
                          'py-3 rounded-xl text-[12px] display font-bold border transition-all',
                          esInicio || esFin ? 'bg-brasa border-brasa text-carbon shadow-md shadow-brasa/20' :
                          enRango ? 'bg-brasa/15 border-brasa/30 text-hueso' :
                          'border-borde text-ceniza hover:border-brasa/40 hover:text-hueso',
                        ].join(' ')}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
                {horaInicio && (
                  <p className="mt-3 text-[13px] text-ceniza ml-1">
                    Rango: <span className="text-brasa font-semibold">{rangoLabel}</span>
                  </p>
                )}
              </div>

              {/* Paso 4 — Datos */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-7 h-7 rounded-full display font-black text-[13px] flex items-center justify-center flex-shrink-0 transition-colors ${horaFin ? 'bg-brasa text-carbon' : 'bg-borde text-ceniza'}`}>4</div>
                  <div className="display font-black text-[13px] tracking-[0.1em] text-hueso">TUS DATOS</div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">NOMBRE *</span>
                    <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre completo"
                      className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[15px] focus:border-brasa outline-none transition-colors" />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">WHATSAPP</span>
                    <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+56 9 xxxx xxxx"
                      className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[15px] focus:border-brasa outline-none transition-colors" />
                  </label>
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TIPO DE SERVICIO</span>
                    <select value={servicio} onChange={(e) => setServicio(e.target.value)}
                      className="bg-humo border border-borde rounded-xl px-3.5 py-3 text-hueso text-[15px] focus:border-brasa outline-none transition-colors">
                      {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Columna derecha — Resumen sticky */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-humo border border-borde rounded-2xl overflow-hidden">
                <div className="bg-carbon border-b border-borde px-6 py-4">
                  <div className="display font-black text-[11px] tracking-[0.12em] text-ceniza">RESUMEN DE TU RESERVA</div>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  {[
                    { label: 'Tipo', value: tipo, icon: '📌' },
                    { label: 'Fecha', value: fechaSel ? formatFechaLarga(fechaSel) : null, icon: '📅' },
                    { label: 'Horario', value: horaInicio ? rangoLabel : null, icon: '⏰' },
                    { label: 'Servicio', value: servicio, icon: '🍖' },
                    { label: 'Nombre', value: nombre || null, icon: '👤' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="display font-bold text-[10px] tracking-[0.08em] text-ceniza">{r.label}</div>
                        <div className={`text-[14px] leading-snug mt-0.5 ${r.value ? 'text-hueso' : 'text-ceniza/40'}`}>
                          {r.value ?? '—'}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-2 pt-4 border-t border-borde/60">
                    <button
                      onClick={reservarWhatsApp}
                      disabled={!puedeReservar}
                      className="w-full display font-black text-[13px] tracking-[0.08em] bg-brasa text-carbon py-4 rounded-xl disabled:opacity-30 hover:brightness-110 disabled:cursor-not-allowed transition-all"
                    >
                      RESERVAR POR WHATSAPP →
                    </button>
                    <p className="mt-3 text-[11px] text-ceniza text-center leading-snug">
                      Al reservar se envía la información al WhatsApp<br />+56 9 6121 3577
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
