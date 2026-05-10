import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate');
    const endDate = control.get('endDate');

    if (!startDate?.value || !endDate?.value) return null;

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    return end <= start ? { dateRange: true } : null;
  };
}
