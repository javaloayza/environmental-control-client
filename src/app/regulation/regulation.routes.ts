import { Routes } from '@angular/router';

export const REGULATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/regulation-list/regulation-list.component').then(m => m.RegulationListComponent)
  },
];
