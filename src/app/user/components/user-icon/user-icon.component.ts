import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 's11-user-icon',
  standalone: true,
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
})
export class UserIconComponent {
  private router = inject(Router);

  @Input()
  userUrl?: string;

  constructor() {}

  goToProfile() {
    this.router.navigate(['profile']);
  }
}
