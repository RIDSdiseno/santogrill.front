interface Props {
  titulo: string;
  subtitulo: string;
  onRecargar?: () => void;
  onExportar?: () => void;
}

export function Encabezado({ titulo, subtitulo, onRecargar, onExportar }: Props) {
  return (
    <header className="flex items-end justify-between gap-4 flex-wrap mb-5">
      <div>
        <h1 className="display font-black text-2xl">{titulo}</h1>
        <p className="text-sm text-ceniza mt-1">{subtitulo}</p>
      </div>
      <div className="flex gap-2.5">
        {onRecargar && (
          <button onClick={onRecargar} className="bg-humo border border-borde display font-bold text-[11px] tracking-[0.08em] px-4 py-2.5 rounded-md hover:border-brasa">
            RECARGAR
          </button>
        )}
        {onExportar && (
          <button onClick={onExportar} className="bg-brasa text-carbon display font-extrabold text-[11px] tracking-[0.08em] px-4 py-2.5 rounded-md hover:bg-brasa-claro">
            EXPORTAR CSV
          </button>
        )}
      </div>
    </header>
  );
}
