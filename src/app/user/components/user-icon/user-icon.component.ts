import { Component, Input } from '@angular/core';

@Component({
  selector: 's11-user-icon',
  standalone: true,
  imports: [],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
})
export class UserIconComponent {
  @Input()
  userUrl?: string;
}
