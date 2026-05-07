import { Routes } from '@angular/router';
import { TripsOverview } from './components/trips-overview/trips-overview';

export const routes: Routes = [
  {
    path: '/overview',
    component: TripsOverview,
  },
  {
    path: '**',
    redirectTo: '/overview',
  },
];
