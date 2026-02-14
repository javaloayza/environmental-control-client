import { Routes } from '@angular/router';

export const MONITORING_TYPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/monitoring-type-list/monitoring-type-list.component').then(m => m.MonitoringTypeListComponent)
  },
];
