import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const base = 'w-full bg-carbon border border-borde rounded-lg px-3.5 py-3 text-hueso text-[15px] outline-none focus:border-brasa';

export function Campo({ etiqueta, ...props }: InputHTMLAttributes<HTMLInputElement> & { etiqueta?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {etiqueta && <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">{etiqueta.toUpperCase()}</span>}
      <input {...props} className={base} />
    </label>
  );
}

export function AreaTexto({ etiqueta, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { etiqueta?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {etiqueta && <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">{etiqueta.toUpperCase()}</span>}
      <textarea {...props} className={`${base} resize-y`} />
    </label>
  );
}
