import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('@features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  // },
  // {
  //   path: 'events',
  //   loadChildren: () => import('@events/events.routes').then(m => m.EVENTS_ROUTES),
  // },
  // { path: '', redirectTo: 'auth', pathMatch: 'full' },
];
