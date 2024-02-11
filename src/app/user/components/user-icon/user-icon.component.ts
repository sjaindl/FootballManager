import { Component, Input } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
// import { Mat_Ico } from '@angular/material/icon';

@Component({
  selector: 's11-user-icon',
  standalone: true,
  imports: [MatFabButton],
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
})
export class UserIconComponent {
  @Input()
  userUrl?: string;
}
