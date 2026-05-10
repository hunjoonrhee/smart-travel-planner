export const TRIP_STATUS = {
  DRAFT: 'draft',
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export type TripStatus = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];
