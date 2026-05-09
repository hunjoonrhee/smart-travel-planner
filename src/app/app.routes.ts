import { Routes } from '@angular/router';
import { TripsOverview } from './components/trips-overview/trips-overview';
import { NewTrip } from './pages/new-trip/new-trip';
import { TripDetail } from './pages/trip-detail/trip-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    component: TripsOverview,
  },
  { path: 'overview/:id', component: TripDetail },
  {
    path: 'new-trip',
    component: NewTrip,
  },
  {
    path: 'edit/:id',
    component: NewTrip,
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
