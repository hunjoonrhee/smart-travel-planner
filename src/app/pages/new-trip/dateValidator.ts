import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DateValidator(startField: string, endField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get(startField);
    const end = control.get(endField);

    if (!start?.value || !end?.value) return null;

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

    return endDate <= startDate ? { dateRange: true } : null;
  };
}
