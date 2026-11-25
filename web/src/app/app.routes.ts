import { Routes } from '@angular/router';
import { InicioComponent } from './index/index.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'reservar',
    loadComponent: () =>
      import('./reservar/reservar').then((module) => module.ReservarComponent),
  },
  {
    path: 'citas',
    loadComponent: () =>
      import('./citas/citas').then((module) => module.CitasComponent),
  },
  { path: '**', redirectTo: '' },
];