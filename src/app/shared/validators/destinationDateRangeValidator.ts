import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateRangeType } from '../date-range/date-range';

export function DestinationDateRangeValidator(
  getTripDates: () => DateRangeType | null,
  getDestinations: () => Array<any>,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as DateRangeType | null;
    if (!value?.start || !value?.end) return null;

    const tripDates = getTripDates();
    if (!tripDates?.start || !tripDates?.end) return null;

    const destStart = new Date(value.start);
    const destEnd = new Date(value.end);
    const tripStart = new Date(tripDates.start);
    const tripEnd = new Date(tripDates.end);

    // 1. 전체 여행 범위 체크
    if (destStart < tripStart || destEnd > tripEnd) {
      return { destinationOutOfRange: true };
    }

    // 2. 다른 destinations와 겹침 체크 (자기 자신 제외)
    const destinations = getDestinations();
    for (const dest of destinations) {
      if (!dest.destinationDates?.start || !dest.destinationDates?.end) continue;
      if (dest.destinationDates.start === value.start && dest.destinationDates.end === value.end)
        continue; // 자기 자신 제외

      const otherStart = new Date(dest.destinationDates.start);
      const otherEnd = new Date(dest.destinationDates.end);

      if (destStart < otherEnd && destEnd > otherStart) {
        return { destinationsOverlap: true };
      }
    }

    return null;
  };
}
