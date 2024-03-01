import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfileMenuIconComponent } from '../user/components/profile-menu-icon/profile-menu-icon.component';
import { UserIconComponent } from '../user/components/user-icon/user-icon.component';

@Component({
  selector: 's11-header',
  standalone: true,
  imports: [
    MatToolbar,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    UserIconComponent,
    ProfileMenuIconComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
