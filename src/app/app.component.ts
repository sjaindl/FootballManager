import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ProfileMenuIconComponent } from './user/components/profile-menu-icon/profile-menu-icon.component';
import { UserIconComponent } from './user/components/user-icon/user-icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    MatToolbar,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    UserIconComponent,
    ProfileMenuIconComponent,
  ],
})
export class AppComponent {
  title = 'FootballManager';
}
