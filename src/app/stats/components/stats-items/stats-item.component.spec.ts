import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsItemComponent } from './stats-item.component';

describe('StatsComponent', () => {
  let component: StatsItemComponent;
  let fixture: ComponentFixture<StatsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
