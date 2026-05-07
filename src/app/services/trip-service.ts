import { Injectable, signal } from '@angular/core';
import { Trip } from '../models/trip';
import { openDB, IDBPDatabase  } from 'idb';

const DB_NAME = 'travel-planner';
const STORE = 'trips';

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
      }
    })

    const all = await this.idb.getAll(STORE);
    this._trips.set(all);
  }

}
