import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsOverview } from './trips-overview';

describe('TripsOverview', () => {
  let component: TripsOverview;
  let fixture: ComponentFixture<TripsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(TripsOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
