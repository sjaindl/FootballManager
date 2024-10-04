import { Component, effect, inject } from '@angular/core';
import { getState } from '@ngrx/signals';
import { AuthStore } from '../../../auth/store/auth.store';
import { UserIconComponent } from '../user-icon/user-icon.component';

@Component({
  selector: 's11-profile-menu-icon',
  standalone: true,
  imports: [UserIconComponent],
  templateUrl: './profile-menu-icon.component.html',
  styleUrl: './profile-menu-icon.component.scss',
})
export class ProfileMenuIconComponent {
  readonly store = inject(AuthStore);

  constructor() {
    effect(() => {
      const state = getState(this.store);
      console.warn('Active User state changed', state);
    });
  }
}
