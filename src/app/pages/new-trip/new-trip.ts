import { Component, inject, input, OnInit } from '@angular/core';
import { TripService } from '../../services/trip-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TRIP_STATUS, TripStatus } from '../../types/tripStatus';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Currency } from '../../types';
import { MatAnchor } from '@angular/material/button';
import { Trip } from '../../models';
import { Router } from '@angular/router';
import { DateValidator } from './dateValidator';

export type BasicTripData = Omit<
  Trip,
  'id' | 'description' | 'travelers' | 'destinations' | 'createdAt' | 'updatedAt'
>;
@Component({
  selector: 'app-new-trip',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatAnchor,
  ],
  templateUrl: './new-trip.html',
  styleUrl: './new-trip.scss',
})
export class NewTrip implements OnInit {
  readonly id = input<string>();
  readonly router = inject(Router);
  readonly tripService = inject(TripService);
  readonly tripStatuses = Object.values(TRIP_STATUS);
  readonly currencies: Currency[] = ['EUR', 'GBP', 'USD', 'CHF'];

  readonly tripForm = new FormGroup(
    {
      title: new FormControl<string>('', {
        validators: Validators.required,
      }),
      status: new FormControl<TripStatus | ''>('', {
        validators: Validators.required,
      }),
      startDate: new FormControl<string>('', {
        validators: Validators.required,
      }),
      endDate: new FormControl<string>('', {
        validators: Validators.required,
      }),
      budget: new FormControl<number>(0, {
        validators: Validators.min(1),
      }),
      currency: new FormControl<Currency | null>(null, {
        validators: Validators.required,
      }),
    },
    {
      validators: DateValidator(),
    },
  );

  ngOnInit() {
    const id = this.id();
    if (id) {
      this.tripService
        .getTripById(id)
        .then(() => {
          const trip = this.tripService.trip();
          if (trip) {
            this.tripForm.patchValue(trip);
          }
        })
        .catch(console.error);
    }
  }

  async onSubmit() {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }
    const reiseData: BasicTripData = {
      title: this.tripForm.value.title || '',
      status: this.tripForm.value.status as TripStatus,
      startDate: this.tripForm.value.startDate || '',
      endDate: this.tripForm.value.endDate || '',
      budget: this.tripForm.value.budget || 0,
      currency: this.tripForm.value.currency || 'EUR',
    };

    await this.tripService.saveTrip(reiseData);
    this.router.navigate(['/overview']);
  }

  onCancel() {
    this.router.navigate(['/overview']);
  }
}
