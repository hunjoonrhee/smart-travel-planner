import { Component, inject } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-trips-overview',
  imports: [JsonPipe],
  templateUrl: './trips-overview.html',
  styleUrl: './trips-overview.scss',
})
export class TripsOverview {
  readonly tripService = inject(TripService);
}
