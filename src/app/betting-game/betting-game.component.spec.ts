import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingGameComponent } from './betting-game.component';

describe('BettingGameComponent', () => {
  let component: BettingGameComponent;
  let fixture: ComponentFixture<BettingGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BettingGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BettingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
