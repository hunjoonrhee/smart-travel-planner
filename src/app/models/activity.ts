import { ActivityPriority } from '../types/activityPriority';
import { ActivityType } from '../types/activityType';
import { BookingStatus } from '../types/bookingStatus';

export interface Activity {
  id: string;
  name: string;
  date: string;
  type: ActivityType;
  priority: ActivityPriority;
  cost: number;
  notes?: string;
  bookingStatus: BookingStatus;
}
