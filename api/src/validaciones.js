// Reglas de validación de una reserva.
const PATRON_TELEFONO = /^0\d{9}$/;              // 10 dígitos, inicia con 0
const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;      // AAAA-MM-DD
const PATRON_HORA = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:MM (00:00 a 23:59)

// Devuelve la fecha local de hoy como AAAA-MM-DD.
function fechaDeHoy(hoy) {
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// Comprueba que la fecha exista de verdad (rechaza 2026-02-30).
function fechaExiste(texto) {
  if (!PATRON_FECHA.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const f = new Date(anio, mes - 1, dia);
  return f.getFullYear() === anio && f.getMonth() === mes - 1 && f.getDate() === dia;
}

// El parámetro "hoy" permite probar la regla con una fecha fija.
function validarReserva(reserva = {}, hoy = new Date()) {
  const datos = {
    nombre: String(reserva.nombre ?? '').trim(),
    telefono: String(reserva.telefono ?? '').trim(),
    servicio: String(reserva.servicio ?? '').trim(),
    fecha: String(reserva.fecha ?? '').trim(),
    hora: String(reserva.hora ?? '').trim(),
    notas: String(reserva.notas ?? '').trim(),
  };
  const errores = [];

  if (datos.nombre.length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres.');
  }
  if (datos.telefono && !PATRON_TELEFONO.test(datos.telefono)) {
    errores.push('El teléfono debe tener 10 dígitos y empezar con 0.');
  }
  if (!datos.servicio) {
    errores.push('Debe elegir un servicio.');
  }
  if (datos.fecha && !fechaExiste(datos.fecha)) {
    errores.push('La fecha no es válida.');
  } else if (datos.fecha && datos.fecha < fechaDeHoy(hoy)) {
    errores.push('La fecha no puede estar en el pasado.');
  }
  if (datos.hora && !PATRON_HORA.test(datos.hora)) {
    errores.push('La hora no es válida.');
  }
  if (datos.notas.length > 200) {
    errores.push('Las notas no pueden superar los 200 caracteres.');
  }

  return { valido: errores.length === 0, errores, datos };
}

module.exports = { validarReserva };