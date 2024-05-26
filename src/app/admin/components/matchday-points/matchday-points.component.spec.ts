import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchdayComponent } from './matchday-points.component';

describe('MatchdayComponent', () => {
  let component: MatchdayComponent;
  let fixture: ComponentFixture<MatchdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchdayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
