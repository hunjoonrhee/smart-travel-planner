import { Activity } from './activity';

export interface Destination {
  id: string;
  city: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  activities: Activity[];
}
