const express = require('express');
const cors = require('cors');
const db = require('./db');
const { validarReserva } = require('./validaciones');

const app = express();

// 1. Configuración de CORS para desarrollo y nube
const ORIGENES_LOCALES = 'http://localhost:4200,http://localhost:8081,http://localhost:8082';
const ORIGENES = (process.env.CORS_ORIGINS ?? ORIGENES_LOCALES)
  .split(',')
  .map((origen) => origen.trim());

app.use(cors({ origin: ORIGENES }));
app.use(express.json());

// 2. Ruta de salud (Health Check para Render)
app.get('/api/salud', (req, res) => {
  res.json({ estado: 'ok' });
});

// 3. Rutas de Reservas (Ahora son ASYNC)
app.get('/api/reservas', async (_req, res) => {
  try {
    res.json(await db.listar());
  } catch (error) {
    console.error('Error al listar reservas:', error);
    res.status(500).json({ errores: ['No se pudieron cargar las reservas.'] });
  }
});

app.post('/api/reservas', async (req, res) => {
  const { valido, errores, datos } = validarReserva(req.body);

  if (!valido) {
    return res.status(400).json({ errores });
  }

  try {
    const id = await db.agregar(datos);
    return res.status(201).json({
      id: Number(id),
      ...datos,
      estado: 'pendiente',
    });
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    return res.status(500).json({ errores: ['No se pudo guardar la reserva.'] });
  }
});

app.delete('/api/reservas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ errores: ['El ID no es válido.'] });
  }

  try {
    const eliminadas = await db.eliminar(id);

    if (eliminadas === 0) {
      return res.status(404).json({ errores: ['Reserva no encontrada.'] });
    }

    return res.status(204).end();
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    return res.status(500).json({ errores: ['No se pudo eliminar la reserva.'] });
  }
});

app.put('/api/reservas/:id/estado', async (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ errores: ['El ID no es válido.'] });
  }

  if (!db.ESTADOS.includes(estado)) {
    return res.status(400).json({ errores: ['Estado no válido.'] });
  }

  try {
    const actualizadas = await db.cambiarEstado(id, estado);

    if (actualizadas === 0) {
      return res.status(404).json({ errores: ['Reserva no encontrada.'] });
    }

    return res.json({ mensaje: 'Estado actualizado correctamente.' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    return res.status(500).json({ errores: ['No se pudo cambiar el estado.'] });
  }
});

module.exports = app;