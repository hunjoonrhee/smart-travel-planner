import { Component, computed, inject, signal } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { TripCard } from '../trip-card/trip-card';
import { TripSearch } from '../trip-search/trip-search';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TripStatus } from '../../types';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-trips-overview',
  imports: [
    TripCard,
    TripSearch,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './trips-overview.html',
  styleUrl: './trips-overview.scss',
})
export class TripsOverview {
  readonly tripService = inject(TripService);
  readonly searchTerm = signal('');
  readonly router = inject(Router);

  readonly filteredTrips = computed(() => {
    const trips = this.tripService.trips();
    const status = this.selectedStatus();
    return trips
      .filter((t) => status === null || t.status === status)
      .filter((trip) => trip.title.toLowerCase().includes(this.searchTerm().toLowerCase()));
  });

  readonly statusControl = new FormControl<TripStatus | null>(null);

  readonly selectedStatus = toSignal(this.statusControl.valueChanges, { initialValue: null });

  readonly tripStatuses = ['active', 'cancelled', 'completed', 'draft', 'planned'] as const;

  newTrip() {
    this.router.navigate(['/new-trip']);
  }

  async deleteTrip(id: string) {
    await this.tripService.deleteTrip(id);
  }
}
