import { Component, inject, input, OnInit } from '@angular/core';
import { TripService } from '../../services/trip-service';

@Component({
  selector: 'app-new-trip',
  imports: [],
  templateUrl: './new-trip.html',
  styleUrl: './new-trip.scss',
})
export class NewTrip implements OnInit {
  readonly id = input<string>();
  readonly tripService = inject(TripService);
  ngOnInit() {
    const id = this.id();
    if (id) {
      this.tripService.getTripById(id).catch(console.error);
    }
  }
}
