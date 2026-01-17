import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { COMPANY_STRING_ROUTES } from './company/constants/company-routes';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'uikit',
        loadChildren: () => import('./pages/uikit/uikit.routes').then(m => m.default)
      },
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.routes').then(m => m.default)
      },
      {
        path: COMPANY_STRING_ROUTES.ROOT,
        loadChildren: () => import('./company/company.routes').then(m => m.COMPANY_ROUTES)
      },
    ]
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing').then(m => ({ default: [{ path: '', component: m.Landing }] }))
  },
  {
    path: 'notfound',
    loadChildren: () => import('./pages/notfound/notfound').then(m => ({ default: [{ path: '', component: m.Notfound }] }))
  },
  {
    path: '**',
    redirectTo: '/notfound'
  }
];
