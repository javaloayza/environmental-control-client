import { Routes } from '@angular/router';
import { PARAMETER_STRING_ROUTES } from './constants';

export const PARAMETER_ROUTES: Routes = [
    {
        path: '',
        data: { breadcrumb: 'Parámetros' },
        children: [
            {
                path: '',
                redirectTo: PARAMETER_STRING_ROUTES.LIST,
                pathMatch: 'full'
            },
            {
                path: PARAMETER_STRING_ROUTES.LIST,
                loadComponent: () => import('./pages/parameter-list/parameter-list.component').then(m => m.ParameterListComponent),
                data: { breadcrumb: 'Listado' }
            }
        ]
    }
];

export default PARAMETER_ROUTES;
