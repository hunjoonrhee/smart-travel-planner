import { Injectable, signal } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Trip } from '../models';

const DB_NAME = 'travel-planner';
const STORE = 'trips';
const SEED_DATA: Trip[] = [
  {
    id: '1',
    title: 'Travel to Seoul',
    startDate: '2026-07-14',
    endDate: '2026-08-05',
    budget: 2000,
    currency: 'EUR',
    description: 'Go to home',
    status: 'planned',
    travelers: [],
    destinations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Travel to Schwarzwald',
    startDate: '2026-12-30',
    endDate: '2027-01-03',
    budget: 1000,
    currency: 'EUR',
    description: 'First Family trip',
    status: 'planned',
    travelers: [],
    destinations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private idb!: IDBPDatabase;
  private _trips = signal<Trip[]>([]);
  readonly trips = this._trips.asReadonly();

  async init() {
    this.idb = await openDB(DB_NAME, 1, {
      upgrade(idb) {
        if (!idb.objectStoreNames.contains(STORE)) {
          idb.createObjectStore(STORE, { keyPath: 'id' });
        }
      },
    });

    const all = await this.idb.getAll(STORE);
    if (all.length === 0) {
      for (const trip of SEED_DATA) {
        await this.idb.add(STORE, trip);
      }
      this._trips.set(SEED_DATA);
    } else {
      this._trips.set(all);
    }
  }
}
