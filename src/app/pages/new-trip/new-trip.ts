import { Component, effect, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { BasicTripData } from '../../models/trip';
import { TripService } from '../../services/trip-service';
import { Currency } from '../../types';
import { TRIP_STATUS, TripStatus } from '../../types/tripStatus';
import { DateValidator } from './dateValidator';
import { MatIconModule } from '@angular/material/icon';
import { Traveler } from '../../models';

@Component({
  selector: 'app-new-trip',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatAnchor,
    MatIconModule,
  ],
  templateUrl: './new-trip.html',
  styleUrl: './new-trip.scss',
})
export class NewTrip {
  readonly id = input<string>();
  readonly router = inject(Router);
  readonly tripService = inject(TripService);
  readonly tripStatuses = Object.values(TRIP_STATUS);
  readonly currencies: Currency[] = ['EUR', 'GBP', 'USD', 'CHF'];

  readonly traveler = new FormGroup({
    name: new FormControl<string>('', {
      validators: Validators.required,
    }),
    age: new FormControl<number>(0, {
      validators: Validators.min(1),
    }),
    passportNumber: new FormControl<string>(''),
    notes: new FormControl<string>(''),
  });

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
      travelers: new FormArray<FormGroup>([
        new FormGroup({
          name: new FormControl<string>('', Validators.required),
          age: new FormControl<number>(0, Validators.min(1)),
          passportNumber: new FormControl<string>(''),
          notes: new FormControl<string>(''),
        }),
      ]),
    },
    {
      validators: DateValidator(),
    },
  );

  get travelersControl() {
    return this.tripForm.get('travelers') as FormArray<FormGroup>;
  }

  private readonly _loadTrip = effect(() => {
    const id = this.id(); // ← 이 signal을 추적
    if (id) {
      this.tripService
        .getTripById(id)
        .then((trip) => this.tripForm.patchValue(trip))
        .catch(console.error);
    }
  });

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
      travelers: this.tripForm.value.travelers as Traveler[],
    };

    await this.tripService.saveTrip(reiseData);
    this.router.navigate(['/overview']);
  }

  onCancel() {
    this.router.navigate(['/overview']);
  }

  reisendenHinzufuegen() {
    this.travelersControl.push(
      new FormGroup({
        name: new FormControl<string>('', Validators.required),
        age: new FormControl<number>(0, Validators.min(1)),
        passportNumber: new FormControl<string>(''),
        notes: new FormControl<string>(''),
      }),
    );
  }

  reisendeEntfernen(index: number) {
    this.travelersControl.removeAt(index);
  }
}
