import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupRowComponent } from './lineup-row.component';

describe('LineupRowComponent', () => {
  let component: LineupRowComponent;
  let fixture: ComponentFixture<LineupRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LineupRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
