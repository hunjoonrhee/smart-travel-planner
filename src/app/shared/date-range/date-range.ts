import { Component, computed, forwardRef, input, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export type DateRangeType = {
  start: string;
  end: string;
};

@Component({
  selector: 'app-date-range',
  imports: [MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateRangeComponent), multi: true },
  ],
  templateUrl: './date-range.html',
  styleUrl: './date-range.scss',
})
export class DateRangeComponent implements ControlValueAccessor {
  readonly startLabel = input<string>('Startdatum');
  readonly endLabel = input<string>('Enddatum');
  // 내부 상태
  startDate = signal<string>('');
  endDate = signal<string>('');

  // Forms가 주입해줄 콜백들
  private onChange: (value: DateRangeType) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: DateRangeType | null): void {
    this.startDate.set(value?.start ?? '');
    this.endDate.set(value?.end ?? '');
  }
  registerOnChange(fn: (value: DateRangeType) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  // 날짜 바뀔 때 Forms에 알림
  onStartChange(value: string) {
    this.startDate.set(value);
    this.onChange({ start: this.startDate(), end: this.endDate() });
    this.onTouched();
  }

  onEndChange(value: string) {
    this.endDate.set(value);
    this.onChange({ start: this.startDate(), end: this.endDate() });
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as { start: string; end: string } | null;
    if (!value?.start || !value?.end) return null;
    const start = new Date(value.start);
    const end = new Date(value.end);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    return end <= start ? { dateRange: true } : null;
  }

  hasDateRangeError = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    if (!start || !end) return false;
    return new Date(end) <= new Date(start);
  });
}
