const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ESTADOS = ['pendiente', 'confirmada', 'atendida', 'cancelada'];

// Crea la tabla en PostgreSQL
const listo = pool.query(`CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT,
  servicio TEXT NOT NULL,
  fecha TEXT,
  hora TEXT,
  notas TEXT,
  estado TEXT NOT NULL DEFAULT 'pendiente'
)`);

listo.catch((error) => console.error('No se pudo preparar PostgreSQL:', error.message));

const listar = async () => {
  await listo;
  const { rows } = await pool.query('SELECT * FROM reservas ORDER BY fecha, hora');
  return rows;
};

const agregar = async ({ nombre, telefono, servicio, fecha, hora, notas }) => {
  await listo;
  const { rows } = await pool.query(
    `INSERT INTO reservas (nombre, telefono, servicio, fecha, hora, notas)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [nombre, telefono || null, servicio, fecha || null, hora || null, notas || null]
  );
  return rows[0].id;
};

const eliminar = async (id) => {
  await listo;
  const { rowCount } = await pool.query('DELETE FROM reservas WHERE id = $1', [id]);
  return rowCount;
};

const cambiarEstado = async (id, estado) => {
  if (!ESTADOS.includes(estado)) throw new Error('Estado no válido');
  await listo;
  const { rowCount } = await pool.query('UPDATE reservas SET estado = $1 WHERE id = $2', [estado, id]);
  return rowCount;
};

module.exports = { ESTADOS, listar, agregar, eliminar, cambiarEstado };