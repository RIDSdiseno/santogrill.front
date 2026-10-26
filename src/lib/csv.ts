/** Descarga un CSV con BOM para que Excel en español lo abra bien. */
export function descargarCSV(nombre: string, columnas: string[], filas: Array<Array<string | number>>) {
  const esc = (v: string | number) => '"' + String(v).replace(/"/g, '""') + '"';
  const csv = [columnas.map(esc).join(';'), ...filas.map((f) => f.map(esc).join(';'))].join('\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre + '.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
