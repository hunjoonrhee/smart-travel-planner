import { Component, input } from '@angular/core';
import { Trip } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trip-card',
  imports: [MatInputModule, MatFormFieldModule, MatCardModule, MatChipsModule, DatePipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
  readonly trip = input.required<Trip>();
}
