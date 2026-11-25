import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ReservaApi } from '../reserva-api';

const fechaNoPasada: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const valor = String(control.value ?? '');
  if (!valor) return null;

  const partes = valor.split('-').map(Number);
  if (partes.length !== 3) return { fechaInvalida: true };

  const [anio, mes, dia] = partes;
  const seleccionada = new Date(anio, mes - 1, dia);

  if (
    seleccionada.getFullYear() !== anio ||
    seleccionada.getMonth() !== mes - 1 ||
    seleccionada.getDate() !== dia
  ) {
    return { fechaInvalida: true };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  return seleccionada < hoy ? { fechaPasada: true } : null;
};

function fechaLocalHoy(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-reservar',
  imports: [ReactiveFormsModule],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css',
})
export class ReservarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ReservaApi);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly minFecha = fechaLocalHoy();
  protected readonly guardando = signal(false);
  protected readonly mensaje = signal('');
  protected readonly esError = signal(false);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.pattern(/^0\d{9}$/)]],
    servicio: ['', Validators.required],
    fecha: ['', [Validators.required, fechaNoPasada]],
    hora: ['', Validators.required],
    notas: ['', Validators.maxLength(200)],
  });

  ngOnInit(): void {
    const servicio = this.ruta.snapshot.queryParamMap.get('servicio');

    if (servicio) {
      this.formulario.controls.servicio.setValue(servicio);
    }
  }

  protected resumen(): string {
    const datos = this.formulario.getRawValue();
    const lineas = ['Hola Aura Stetic Spa, quisiera reservar una cita.', ''];

    if (datos.nombre.trim()) lineas.push(`Nombre: ${datos.nombre.trim()}`);
    if (datos.servicio) lineas.push(`Tratamiento: ${datos.servicio}`);

    const cuando: string[] = [];
    if (datos.fecha) cuando.push(this.fechaBonita(datos.fecha));
    if (datos.hora) cuando.push(`a las ${this.horaBonita(datos.hora)}`);
    if (cuando.length) lineas.push(`Preferiría: ${cuando.join(' ')}`);

    if (datos.telefono.trim()) lineas.push(`Teléfono: ${datos.telefono.trim()}`);
    if (datos.notas.trim()) lineas.push(`Nota: ${datos.notas.trim()}`);

    return datos.nombre.trim() || datos.servicio ? lineas.join('\n') : '';
  }

  protected guardar(): void {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      this.mostrar('Revisa los campos marcados antes de continuar.', true);
      return;
    }

    const datos = this.formulario.getRawValue();
    this.guardando.set(true);
    this.mostrar('Guardando tu solicitud…', false);

    this.api.agregar(datos)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: () => {
          const telefonoSpa = '593999406511';
          const url = `https://wa.me/${telefonoSpa}?text=${encodeURIComponent(this.resumen())}`;
          window.location.assign(url);
        },
error: (error: HttpErrorResponse) => {
  console.error('Error al guardar la reserva:', error.status, error.error);

  const errores = error.error?.errores;
  const detalle = Array.isArray(errores)
    ? errores.join(' ')
    : error.error?.message ?? error.message;

  this.mostrar(
    error.status === 0
      ? 'No se pudo conectar con la API.'
      : `La API respondió con error ${error.status}: ${detalle}`,
    true,
  );
},
      });
  }

  private fechaBonita(valor: string): string {
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    return new Intl.DateTimeFormat('es-EC', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(fecha);
  }

  private horaBonita(valor: string): string {
    const [hora, minutos] = valor.split(':').map(Number);
    const sufijo = hora < 12 ? 'am' : 'pm';
    const hora12 = hora % 12 || 12;

    return `${hora12}:${String(minutos).padStart(2, '0')} ${sufijo}`;
  }

  private mostrar(texto: string, error: boolean): void {
    this.mensaje.set(texto);
    this.esError.set(error);
  }
}