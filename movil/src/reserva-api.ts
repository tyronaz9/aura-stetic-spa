import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type EstadoReserva =
  | 'pendiente'
  | 'confirmada'
  | 'atendida'
  | 'cancelada';

export interface Reserva {
  id: number;
  nombre: string;
  telefono: string | null;
  servicio: string;
  fecha: string | null;
  hora: string | null;
  notas: string | null;
  estado: EstadoReserva;
}

export interface NuevaReserva {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  notas: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaApi {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://aura-spa-api.onrender.com/api/reservas';

  listar() {
    return this.http.get<Reserva[]>(this.url);
  }

  agregar(reserva: NuevaReserva) {
    return this.http.post<Reserva>(this.url, reserva);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  cambiarEstado(id: number, estado: EstadoReserva) {
    return this.http.put<{ mensaje: string }>(
      `${this.url}/${id}/estado`,
      { estado },
    );
  }
}