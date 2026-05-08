import { Component, computed, inject, signal } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { TripCard } from '../trip-card/trip-card';
import { TripSearch } from '../trip-search/trip-search';

@Component({
  selector: 'app-trips-overview',
  imports: [TripCard, TripSearch],
  templateUrl: './trips-overview.html',
  styleUrl: './trips-overview.scss',
})
export class TripsOverview {
  readonly tripService = inject(TripService);
  readonly searchTerm = signal('');

  readonly filteredTrips = computed(() => {
    const trips = this.tripService.trips();
    return trips.filter((trip) =>
      trip.title.toLowerCase().includes(this.searchTerm().toLowerCase()),
    );
  });
}
