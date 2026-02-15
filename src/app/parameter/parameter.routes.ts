import { Routes } from '@angular/router';

export const PARAMETER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/parameter-list/parameter-list.component').then(m => m.ParameterListComponent)
  },
];
