import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseWrapperComponent } from './firebase-wrapper.component';

describe('FirebaseWrapperComponent', () => {
  let component: FirebaseWrapperComponent;
  let fixture: ComponentFixture<FirebaseWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirebaseWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
