export function fechaHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function fechaDesdeTexto(valor: string): Date | null {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (!coincidencia) return null;

  const [, anio, mes, dia] = coincidencia;
  const fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
  if (
    fecha.getFullYear() !== Number(anio)
    || fecha.getMonth() !== Number(mes) - 1
    || fecha.getDate() !== Number(dia)
  ) return null;
  return fecha;
}

export function textoFecha(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

export function textoHora(fecha: Date): string {
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${hora}:${minutos}`;
}

export function fechaBonita(valor: string): string {
  if (!valor) return '';
  const fecha = fechaDesdeTexto(valor);
  if (!fecha) return valor;
  return new Intl.DateTimeFormat('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fecha);
}

export function horaBonita(valor: string): string {
  if (!valor) return '';
  const [hora, minutos] = valor.split(':').map(Number);
  return `${hora % 12 || 12}:${String(minutos).padStart(2, '0')} ${hora < 12 ? 'am' : 'pm'}`;
}
