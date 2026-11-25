const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

const db = require('../src/db');
db.iniciar(':memory:');

const app = require('../src/app');

let servidor;
let url;
let idReserva;

before(async () => {
  servidor = app.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  url = `http://127.0.0.1:${servidor.address().port}/api/reservas`;
});

after(async () => {
  if (servidor?.listening) {
    await new Promise((resolver) => servidor.close(resolver));
  }

  db.cerrar();
});

const enviar = (datos) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

test('POST crea una reserva y responde 201', async () => {
  const respuesta = await enviar({
    nombre: 'Ana Pérez',
    telefono: '0991234567',
    servicio: 'Limpieza básica',
    fecha: '2099-12-31',
    hora: '14:30',
    notas: 'Prueba de integración',
  });

  assert.equal(respuesta.status, 201);

  const reserva = await respuesta.json();
  assert.equal(reserva.nombre, 'Ana Pérez');
  idReserva = reserva.id;
});

test('GET devuelve las reservas guardadas', async () => {
  const respuesta = await fetch(url);
  assert.equal(respuesta.status, 200);

  const reservas = await respuesta.json();
  assert.equal(reservas.length, 1);
  assert.equal(reservas[0].id, idReserva);
});

test('POST rechaza una reserva inválida con 400', async () => {
  const respuesta = await enviar({
    nombre: 'Al',
    telefono: '123',
    servicio: '',
  });

  assert.equal(respuesta.status, 400);

  const cuerpo = await respuesta.json();
  assert.ok(cuerpo.errores.length > 0);
});

test('PUT cambia el estado de la reserva', async () => {
  const respuesta = await fetch(`${url}/${idReserva}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'confirmada' }),
  });

  assert.equal(respuesta.status, 200);

  const [reserva] = await (await fetch(url)).json();
  assert.equal(reserva.estado, 'confirmada');
});

test('DELETE elimina la reserva y responde 204', async () => {
  const respuesta = await fetch(`${url}/${idReserva}`, {
    method: 'DELETE',
  });

  assert.equal(respuesta.status, 204);

  const reservas = await (await fetch(url)).json();
  assert.equal(reservas.length, 0);
});