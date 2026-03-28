import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { COMPANY_STRING_ROUTES } from './company/constants/company-routes';
import { JweAuthGuard } from '@core/interceptors/jwe-auth.guard';
import { REGULATION_STRING_ROUTES } from './regulation/constants/regulation-routes';
import { LOCATION_STRING_ROUTES } from './location/constants/location-routes';
import { MONITORING_TYPE_STRING_ROUTES } from './monitoring-type/constants/monitoring-type-routes';
import { SPECIFIC_LOCATION_STRING_ROUTES } from './specific-location/constants/specific-location-routes';
import { STANDARD_STRING_ROUTES } from './standard/constants/standard-routes';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [JweAuthGuard],
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
      {
        path: REGULATION_STRING_ROUTES.ROOT,
        loadChildren: () => import('./regulation/regulation.routes').then(m => m.REGULATION_ROUTES)
      },
      {
        path: LOCATION_STRING_ROUTES.ROOT,
        loadChildren: () => import('./location/location.routes').then(m => m.LOCATION_ROUTES)
      },
      {
        path: MONITORING_TYPE_STRING_ROUTES.ROOT,
        loadChildren: () => import('./monitoring-type/monitoring-type.routes').then(m => m.MONITORING_TYPE_ROUTES)
      },
      {
        path: SPECIFIC_LOCATION_STRING_ROUTES.ROOT,
        loadChildren: () => import('./specific-location/specific-location.routes').then(m => m.SPECIFIC_LOCATION_ROUTES)
      },
      {
        path: STANDARD_STRING_ROUTES.ROOT,
        loadChildren: () => import('./standard/standard.routes').then(m => m.STANDARD_ROUTES)
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
