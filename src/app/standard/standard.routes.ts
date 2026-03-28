import { Routes } from '@angular/router';

export const STANDARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/standard-list/standard-list.component').then(m => m.StandardListComponent)
  },
];
