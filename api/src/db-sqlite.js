
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const SQLITE_CONSTRAINT_UNIQUE = 2067;
// Usamos spa.db porque es el nombre de tu base de datos
const archivo = process.env.DB_ARCHIVO ?? path.join(__dirname, '..', 'spa.db');
const db = new DatabaseSync(archivo);

// Creamos la tabla si no existe con tus columnas originales
db.exec(`CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT,
  servicio TEXT NOT NULL,
  fecha TEXT,
  hora TEXT,
  notas TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente'
)`);

const ESTADOS = ['pendiente', 'confirmada', 'atendida', 'cancelada'];

const listar = async () =>
  db.prepare('SELECT * FROM reservas ORDER BY fecha, hora').all();

const agregar = async ({ nombre, telefono, servicio, fecha, hora, notas }) => {
  try {
    const resultado = db.prepare(`INSERT INTO reservas
      (nombre, telefono, servicio, fecha, hora, notas)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .run(nombre, telefono || null, servicio, fecha || null, hora || null, notas || null);
    return Number(resultado.lastInsertRowid);
  } catch (error) {
    if (error.errcode === SQLITE_CONSTRAINT_UNIQUE) error.duplicado = true;
    throw error;
  }
};

const eliminar = async (id) =>
  Number(db.prepare('DELETE FROM reservas WHERE id = ?').run(id).changes);

const cambiarEstado = async (id, estado) => {
  if (!ESTADOS.includes(estado)) {
    throw new Error('Estado no válido');
  }
  return Number(db.prepare('UPDATE reservas SET estado = ? WHERE id = ?').run(estado, id).changes);
};

module.exports = {
  ESTADOS,
  listar,
  agregar,
  eliminar,
  cambiarEstado,
};