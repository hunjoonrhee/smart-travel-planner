import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArraySection } from './array-section';

describe('ArraySection', () => {
  let component: ArraySection;
  let fixture: ComponentFixture<ArraySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArraySection],
    }).compileComponents();

    fixture = TestBed.createComponent(ArraySection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
