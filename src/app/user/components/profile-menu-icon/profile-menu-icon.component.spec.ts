import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMenuIconComponent } from './profile-menu-icon.component';

describe('ProfileMenuIconComponent', () => {
  let component: ProfileMenuIconComponent;
  let fixture: ComponentFixture<ProfileMenuIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMenuIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileMenuIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
