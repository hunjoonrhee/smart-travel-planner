import { Component, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Destination, Traveler } from '../../models';
import { BasicTripData } from '../../models/trip';
import { TripService } from '../../services/trip-service';
import { ArraySection } from '../../shared/array-section/array-section';
import { DateRangeComponent, DateRangeType } from '../../shared/date-range/date-range';
import { DateValidator } from '../../shared/validators/dateValidator';
import { Currency } from '../../types';
import { TRIP_STATUS, TripStatus } from '../../types/tripStatus';
import { DestinationDateRangeValidator } from '../../shared/validators/destinationDateRangeValidator';

type TravelerForm = {
  name: FormControl<string>;
  age: FormControl<number | null>;
  passportNumber: FormControl<string | null>;
  notes: FormControl<string | null>;
};

type DestinationForm = {
  city: FormControl<string>;
  country: FormControl<string>;
  destinationDates: FormControl<DateRangeType | null>;
  nights: FormControl<number>;
  activities: FormArray;
};

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
    ArraySection,
    DateRangeComponent,
  ],
  templateUrl: './new-trip.html',
  styleUrl: './new-trip.scss',
})
export class NewTrip {
  readonly id = input<string>();
  readonly router = inject(Router);
  readonly destroyRef = inject(DestroyRef);
  readonly tripService = inject(TripService);
  readonly tripStatuses = Object.values(TRIP_STATUS);
  readonly currencies: Currency[] = ['EUR', 'GBP', 'USD', 'CHF'];

  readonly tripForm = new FormGroup({
    title: new FormControl<string>('', { validators: Validators.required }),
    status: new FormControl<TripStatus | ''>('', { validators: Validators.required }),
    tripDates: new FormControl<DateRangeType | null>(null, {
      validators: [Validators.required, DateValidator()],
    }),
    budget: new FormControl<number>(0, { validators: Validators.min(1) }),
    currency: new FormControl<Currency | null>(null, { validators: Validators.required }),
    travelers: new FormArray<FormGroup<TravelerForm>>([]),
    destinations: new FormArray<FormGroup<DestinationForm>>([]),
  });

  constructor() {
    this.createTravelerGroup();
    this.createDestinationGroup();

    this.tripForm
      .get('tripDates')!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.destinationsControl.controls.forEach((ctrl) => {
          ctrl.get('destinationDates')?.updateValueAndValidity();
        });
      });
  }

  get travelersControl() {
    return this.tripForm.get('travelers') as FormArray<FormGroup<TravelerForm>>;
  }

  get destinationsControl() {
    return this.tripForm.get('destinations') as FormArray<FormGroup<DestinationForm>>;
  }

  private readonly _loadTrip = effect(() => {
    const id = this.id(); // ← 이 signal을 추적
    if (id) {
      this.tripService.getTripById(id).then((trip) => {
        // 기존 FormArray 비우고 travelers 수만큼 FormGroup 추가
        this.travelersControl.clear();
        this.destinationsControl.clear();
        trip.travelers.forEach(() => this.createTravelerGroup());
        trip.destinations.forEach(() => this.createDestinationGroup());
        this.tripForm.patchValue({
          ...trip,
          tripDates: { start: trip.startDate, end: trip.endDate },
        });
      });
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
      startDate: this.tripForm.value.tripDates?.start || '',
      endDate: this.tripForm.value.tripDates?.end || '',
      budget: this.tripForm.value.budget || 0,
      currency: this.tripForm.value.currency || 'EUR',
      travelers: this.tripForm.value.travelers as Traveler[],
      destinations: this.tripForm.value.destinations as Destination[],
    };
    if (this.id()) {
      await this.tripService.editTrip(this.id()!, reiseData);
    } else {
      await this.tripService.saveTrip(reiseData);
    }

    this.router.navigate(['/overview']);
  }

  onCancel() {
    this.router.navigate(['/overview']);
  }

  reisendenHinzufuegen() {
    this.createTravelerGroup();
  }

  reisezielHinzufuegen() {
    this.createDestinationGroup();
  }

  reisendeEntfernen(index: number) {
    this.travelersControl.removeAt(index);
  }
  reisezieleEntfernen(index: number) {
    this.destinationsControl.removeAt(index);
  }

  private createTravelerGroup() {
    this.travelersControl.push(
      new FormGroup<TravelerForm>({
        name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
        age: new FormControl<number>(0, Validators.min(1)),
        passportNumber: new FormControl<string>(''),
        notes: new FormControl<string>(''),
      }),
    );
  }

  private createDestinationGroup() {
    const newGroup = new FormGroup<DestinationForm>({
      city: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
      country: new FormControl<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      destinationDates: new FormControl<{ start: string; end: string } | null>(null, {
        validators: [
          Validators.required,
          DateValidator(),
          DestinationDateRangeValidator(
            () => this.tripForm.get('tripDates')?.value ?? null,
            () => this.destinationsControl.getRawValue(),
          ),
        ],
      }),
      nights: new FormControl<number>(0, {
        nonNullable: true,
        validators: Validators.required,
      }),
      activities: new FormArray<FormGroup>([]),
    });

    newGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const dates = newGroup.get('destinationDates')?.value;
      if (dates?.start && dates?.end) {
        const diff = new Date(dates.end).getTime() - new Date(dates.start).getTime();
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        newGroup.get('nights')?.setValue(nights, { emitEvent: false });
      }
    });
    this.destinationsControl.push(newGroup);
  }
}
