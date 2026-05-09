import { Component, input } from '@angular/core';

@Component({
  selector: 'app-new-trip',
  imports: [],
  templateUrl: './new-trip.html',
  styleUrl: './new-trip.scss',
})
export class NewTrip {
  readonly id = input<string>();
}
