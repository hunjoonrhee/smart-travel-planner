import { Component, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-trip-search',
  imports: [MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './trip-search.html',
  styleUrl: './trip-search.scss',
})
export class TripSearch {
  readonly searchControl = new FormControl<string>('', { nonNullable: true });
  readonly searchTerm = model<string>('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        map((v) => v.trim()),
        filter((v) => v.length === 0 || v.length >= 2),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((value) => {
        this.searchTerm.set(value);
      });
  }
}
