import { Injectable, signal } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { Trip } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { BasicTripData } from '../models/trip';

const TODAY = new Date();
const DB_NAME = 'travel-planner';
const STORE = 'trips';
const SEED_DATA: Trip[] = [
  {
    id: uuidv4(),
    title: 'Travel to Seoul',
    startDate: '2026-07-14',
    endDate: '2026-08-05',
    budget: 2000,
    currency: 'EUR',
    description: 'Go to home',
    status: 'planned',
    travelers: [],
    destinations: [],
    createdAt: TODAY.toISOString(),
    updatedAt: TODAY.toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Travel to Schwarzwald',
    startDate: '2026-12-30',
    endDate: '2027-01-03',
    budget: 1000,
    currency: 'EUR',
    description: 'First Family trip',
    status: 'planned',
    travelers: [],
    destinations: [],
    createdAt: TODAY.toISOString(),
    updatedAt: TODAY.toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Travel to Japan',
    startDate: '2025-02-20',
    endDate: '2025-03-15',
    budget: 1500,
    currency: 'EUR',
    description: 'Go to Japan!',
    status: 'completed',
    travelers: [],
    destinations: [],
    createdAt: TODAY.toISOString(),
    updatedAt: TODAY.toISOString(),
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

  async deleteTrip(id: string) {
    await this.idb.delete(STORE, id);
    this._trips.update((trips) => trips.filter((t) => t.id !== id));
  }

  async getTripById(id: string) {
    const trip = await this.idb.get(STORE, id);
    if (!trip) {
      throw new Error('Trip not found!');
    }
    return trip as Trip;
  }

  async saveTrip(data: BasicTripData) {
    const now = new Date().toISOString();
    const entireTripData: Trip = {
      id: uuidv4(),
      ...data,
      travelers: data.travelers.map((t) => ({
        ...t,
        id: uuidv4(), // 서비스에서 주입
      })),
      destinations: data.destinations.map((d) => ({
        ...d,
        id: uuidv4(), // 서비스에서 주입
      })),
      createdAt: now,
      updatedAt: now,
    };
    await this.idb.add(STORE, entireTripData);
    this._trips.update((trips) => [...trips, entireTripData]);
  }

  async editTrip(id: string, data: BasicTripData) {
    const oldTrip = await this.getTripById(id);
    const now = new Date().toISOString();

    const updatedTrip: Trip = {
      id,
      ...data,
      travelers: data.travelers.map((t) => ({
        ...t,
        id: uuidv4(), // 서비스에서 주입
      })),
      destinations: data.destinations.map((d) => ({
        ...d,
        id: uuidv4(), // 서비스에서 주입
      })),
      createdAt: oldTrip.createdAt,
      updatedAt: now,
    };
    await this.idb.put(STORE, updatedTrip);
    this._trips.update((trips) => {
      return trips.map((trip) => (trip.id === id ? updatedTrip : trip));
    });
  }
}
