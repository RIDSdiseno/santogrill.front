import type { ReactNode } from 'react';

interface Props<T> {
  columnas: string[];
  filas: T[];
  render: (fila: T) => ReactNode[];
  clave: (fila: T) => string;
  vacio?: string;
}

export function Tabla<T>({ columnas, filas, render, clave, vacio = 'No hay registros todavía.' }: Props<T>) {
  return (
    <div className="bg-humo border border-borde/60 rounded-xl overflow-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr>
            {columnas.map((c) => (
              <th key={c} className="text-left display font-bold text-[10px] tracking-[0.12em] text-ceniza px-4 py-3.5 border-b border-borde/60 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={clave(fila)}>
              {render(fila).map((celda, i) => (
                <td key={i} className="px-4 py-3 border-b border-borde/40 text-sm text-hueso/85 align-top">{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {filas.length === 0 && <div className="px-4 py-7 text-center text-sm text-ceniza">{vacio}</div>}
    </div>
  );
}
