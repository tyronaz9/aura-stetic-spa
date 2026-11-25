import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { EstadoReserva, Reserva, ReservaApi } from '../reserva-api';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit {
  private readonly api = inject(ReservaApi);

  protected readonly estados: EstadoReserva[] = [
    'pendiente',
    'confirmada',
    'atendida',
    'cancelada',
  ];

  protected readonly citas = signal<Reserva[]>([]);
  protected readonly filtro = signal<EstadoReserva | ''>('');
  protected readonly mensaje = signal('');

  protected readonly citasFiltradas = computed(() => {
    const estado = this.filtro();
    return estado
      ? this.citas().filter((cita) => (cita.estado || 'pendiente') === estado)
      : this.citas();
  });

  protected readonly contador = computed(
    () => `${this.citasFiltradas().length} cita(s) · ${this.citas().length} en total`,
  );

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.api.listar().subscribe({
      next: (datos) => {
        this.citas.set(datos);
        this.mensaje.set('');
      },
      error: (error: unknown) => this.mostrarError(error),
    });
  }

  protected cambiarFiltro(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.filtro.set(
      this.estados.includes(valor as EstadoReserva)
        ? (valor as EstadoReserva)
        : '',
    );
  }

  protected cambiarEstado(cita: Reserva, valor: string): void {
    if (!this.estados.includes(valor as EstadoReserva)) return;

    this.api.cambiarEstado(cita.id, valor as EstadoReserva).subscribe({
      next: () => this.cargar(),
      error: (error: unknown) => this.mostrarError(error),
    });
  }

  protected eliminar(cita: Reserva): void {
    if (!window.confirm(`¿Eliminar la cita #${cita.id} de ${cita.nombre}?`)) {
      return;
    }

    this.api.eliminar(cita.id).subscribe({
      next: () => this.cargar(),
      error: (error: unknown) => this.mostrarError(error),
    });
  }

  private mostrarError(error: unknown): void {
    const mensaje =
      error instanceof Error ? error.message : 'Ocurrió un error al cargar las citas.';
    this.mensaje.set(`Error con la base de datos: ${mensaje}`);
  }
}