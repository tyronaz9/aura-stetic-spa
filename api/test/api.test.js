const path = require('node:path');
const Database = require('better-sqlite3');

let db;

// Estados posibles de una cita (pantalla citas.html)
const ESTADOS = ['pendiente', 'confirmada', 'atendida', 'cancelada'];
const COLUMNA_ESTADO = `estado TEXT NOT NULL DEFAULT 'pendiente'
      CHECK (estado IN ('pendiente','confirmada','atendida','cancelada'))`;

function iniciar(
  ruta = process.env.DB_ARCHIVO ?? path.join(__dirname, '..', 'spa.db'),
) {
  db = new Database(ruta, { timeout: 5000 });

  try {
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
  } catch (error) {
    if (error.code !== 'SQLITE_BUSY' && !/database is locked/i.test(error.message)) {
      cerrar();
      throw error;
    }

    console.warn(
      'SQLite está ocupado; se mantendrá el modo de diario actual:',
      error.message,
    );
  }

  const tabla = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'reservas'",
  ).get();

  if (!tabla) {
    crearTablaReservas();
    return;
  }

  const columnas = db.pragma('table_info(reservas)');
  const nombres = new Set(columnas.map(({ name }) => name));

  const esquemaActual = [
    'id',
    'nombre',
    'telefono',
    'servicio',
    'fecha',
    'hora',
    'notas',
  ].every((nombre) => nombres.has(nombre))
    && columnas.find(({ name }) => name === 'nombre').notnull
    && !columnas.find(({ name }) => name === 'telefono').notnull
    && columnas.find(({ name }) => name === 'servicio').notnull
    && !columnas.find(({ name }) => name === 'fecha').notnull
    && !columnas.find(({ name }) => name === 'hora').notnull
    && !columnas.find(({ name }) => name === 'notas').notnull;

  if (esquemaActual) {
    // Bases creadas antes de la pantalla de citas: se agrega la columna estado.
    if (!nombres.has('estado')) {
      try {
        db.exec(`ALTER TABLE reservas ADD COLUMN ${COLUMNA_ESTADO}`);
      } catch (error) {
        if (error.code !== 'SQLITE_BUSY' && !/database is locked/i.test(error.message)) {
          throw error;
        }

        console.warn(
          'SQLite está ocupado; la columna estado se agregará en el próximo inicio:',
          error.message,
        );
      }
    }

    return;
  }

  const servicio = nombres.has('servicio')
    ? 'servicio'
    : nombres.has('servicios')
      ? 'servicios'
      : "''";

  const expresion = (nombre, fallback = 'NULL') =>
    nombres.has(nombre) ? nombre : fallback;

  db.transaction(() => {
    db.exec(`CREATE TABLE reservas_nueva (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT,
      servicio TEXT NOT NULL,
      fecha TEXT,
      hora TEXT,
      notas TEXT,
      ${COLUMNA_ESTADO}
    )`);

    const estado = nombres.has('estado')
      ? `CASE
          WHEN estado IN ('pendiente','confirmada','atendida','cancelada')
          THEN estado
          ELSE 'pendiente'
        END`
      : "'pendiente'";

    db.exec(`INSERT INTO reservas_nueva
      (id, nombre, telefono, servicio, fecha, hora, notas, estado)
      SELECT
        id,
        COALESCE(nombre, ''),
        ${expresion('telefono')},
        ${servicio},
        ${expresion('fecha')},
        ${expresion('hora')},
        ${expresion('notas')},
        ${estado}
      FROM reservas`);

    db.exec('DROP TABLE reservas');
    db.exec('ALTER TABLE reservas_nueva RENAME TO reservas');
  })();
}

function cerrar() {
  if (db && db.open) db.close();
  db = undefined;
}

function crearTablaReservas() {
  db.exec(`CREATE TABLE reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT,
    servicio TEXT NOT NULL,
    fecha TEXT,
    hora TEXT,
    notas TEXT,
    ${COLUMNA_ESTADO}
  )`);
}

const listar = () =>
  db.prepare('SELECT * FROM reservas ORDER BY fecha, hora').all();

const agregar = ({ nombre, telefono, servicio, fecha, hora, notas }) =>
  db.prepare(`INSERT INTO reservas
    (nombre, telefono, servicio, fecha, hora, notas)
    VALUES (?, ?, ?, ?, ?, ?)`)
    .run(
      nombre,
      telefono || null,
      servicio,
      fecha || null,
      hora || null,
      notas || null,
    ).lastInsertRowid;

const eliminar = (id) =>
  db.prepare('DELETE FROM reservas WHERE id = ?').run(id).changes;

function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) {
    throw new Error('Estado no válido');
  }

  return db.prepare('UPDATE reservas SET estado = ? WHERE id = ?')
    .run(estado, id).changes;
}

module.exports = {
  ESTADOS,
  iniciar,
  cerrar,
  listar,
  agregar,
  eliminar,
  cambiarEstado,
};