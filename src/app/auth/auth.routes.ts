import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../pages/auth/auth.routes').then(m => m.default)
  }
];
