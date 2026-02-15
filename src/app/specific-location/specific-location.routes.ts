import { Routes } from '@angular/router';

export const SPECIFIC_LOCATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/specific-location-list/specific-location-list.component').then(m => m.SpecificLocationListComponent)
  }
];
