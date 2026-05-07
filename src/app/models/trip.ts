import { Currency } from '../types/currency';
import { TripStatus } from '../types/tripStatus';
import { Destination } from './destination';
import { Traveler } from './traveler';

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: Currency;
  description?: string;
  status: TripStatus;
  travelers: Traveler[];
  destinations: Destination[];
  createdAt: string;
  updatedAt: string;
}
