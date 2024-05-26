import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchdayBetsComponent } from './matchday-bets.component';

describe('MatchdayBetsComponent', () => {
  let component: MatchdayBetsComponent;
  let fixture: ComponentFixture<MatchdayBetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchdayBetsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchdayBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
