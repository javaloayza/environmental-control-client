import { Routes } from '@angular/router';
import { RegulationListComponent } from './pages/regulation-list/regulation-list.component';
import { JweAuthGuard } from '../core/interceptors/jwe-auth.guard';

export const REGULATION_ROUTES: Routes = [
  {
    path: '',
    component: RegulationListComponent,
    canActivate: [JweAuthGuard],
    data: { title: 'Regulaciones' }
  }
];
