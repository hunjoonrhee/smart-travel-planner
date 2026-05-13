import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateRangeType } from '../date-range/date-range';

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as DateRangeType | null;

    if (!value?.start || !value?.end) return null;

    const startDate = new Date(value.start);
    const endDate = new Date(value.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

    return endDate <= startDate ? { dateRange: true } : null;
  };
}
