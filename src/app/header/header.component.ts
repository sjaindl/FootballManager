import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

   width = '0px'

  constructor(public authService: AuthService) { }

  signOut() {
    this.authService.signOut()
  }

  navChanged(opened: boolean) {
    this.width = opened ? '100%' : '0px'
  }
}
