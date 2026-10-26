import { useState, useRef, useEffect } from 'react';

const PAISES = [
  { code: 'cl', dial: '+56',  nombre: 'Chile' },
  { code: 'ar', dial: '+54',  nombre: 'Argentina' },
  { code: 'bo', dial: '+591', nombre: 'Bolivia' },
  { code: 'br', dial: '+55',  nombre: 'Brasil' },
  { code: 'co', dial: '+57',  nombre: 'Colombia' },
  { code: 'ec', dial: '+593', nombre: 'Ecuador' },
  { code: 'mx', dial: '+52',  nombre: 'México' },
  { code: 'py', dial: '+595', nombre: 'Paraguay' },
  { code: 'pe', dial: '+51',  nombre: 'Perú' },
  { code: 'es', dial: '+34',  nombre: 'España' },
  { code: 'uy', dial: '+598', nombre: 'Uruguay' },
  { code: 've', dial: '+58',  nombre: 'Venezuela' },
  { code: 'us', dial: '+1',   nombre: 'EE.UU.' },
];

function Flag({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/20x15/${code}.png`}
      width={20} height={15}
      alt={code}
      className="rounded-[2px] flex-shrink-0"
    />
  );
}

interface Props {
  value: string;
  onChange: (dial: string) => void;
}

export function SelectorPais({ value, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const actual = PAISES.find((p) => p.dial === value) ?? PAISES[0]!;

  useEffect(() => {
    function cerrar(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-1.5 bg-carbon border border-borde rounded-lg px-2.5 py-3 text-hueso text-[14px] outline-none focus:border-brasa hover:border-brasa/60 transition-colors h-full w-[86px]"
      >
        <Flag code={actual.code} />
        <span className="font-mono text-[13px]">{actual.dial}</span>
        <svg className={`w-3 h-3 ml-auto text-ceniza transition-transform ${abierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {abierto && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-humo border border-borde rounded-xl shadow-2xl overflow-y-auto max-h-56 w-[180px]">
          {PAISES.map((p) => (
            <button
              key={p.dial}
              type="button"
              onClick={() => { onChange(p.dial); setAbierto(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-borde/40 transition-colors ${p.dial === value ? 'bg-borde/30' : ''}`}
            >
              <Flag code={p.code} />
              <span className="text-[13px] text-hueso">{p.nombre}</span>
              <span className="ml-auto text-[12px] text-ceniza font-mono">{p.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
