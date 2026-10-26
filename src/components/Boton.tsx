import type { ButtonHTMLAttributes } from 'react';

type Variante = 'primario' | 'secundario' | 'fantasma';

const estilos: Record<Variante, string> = {
  primario: 'bg-brasa text-carbon hover:bg-brasa-claro',
  secundario: 'bg-humo text-hueso border border-borde hover:border-brasa',
  fantasma: 'bg-transparent text-ceniza border border-borde hover:text-hueso hover:border-brasa'
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
}

export function Boton({ variante = 'primario', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`display font-extrabold text-xs tracking-[0.08em] px-5 py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
    />
  );
}
