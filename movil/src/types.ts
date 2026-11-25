export type Pestana = 'catalogo' | 'reservar' | 'citas';

export type EstadoReserva =
  | 'pendiente'
  | 'confirmada'
  | 'atendida'
  | 'cancelada';

export type Reserva = {
  id: number;
  nombre: string;
  telefono: string | null;
  servicio: string;
  fecha: string | null;
  hora: string | null;
  notas: string | null;
  estado: EstadoReserva;
};

export type Servicio = {
  nombre: string;
  categoria: 'Faciales' | 'Corporales' | 'Cejas y pestañas';
  descripcion: string;
  precio: number;
  imagen: number;
};

export type Formulario = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  notas: string;
};
