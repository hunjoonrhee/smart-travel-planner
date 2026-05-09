import { Component, inject, input, output } from '@angular/core';
import { Trip } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-trip-card',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,
    DatePipe,
    MatButtonModule,
    MatIcon,
  ],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.scss',
})
export class TripCard {
  readonly trip = input.required<Trip>();
  readonly router = inject(Router);
  readonly deleteTrip = output<string>();
  goToDetail(id: string) {
    this.router.navigate([`/overview/${id}`]);
  }

  editTrip(id: string) {
    this.router.navigate([`/edit/${id}`]);
  }

  removeTrip(id: string) {
    this.deleteTrip.emit(id);
  }
}
