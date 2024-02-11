import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

   width = '0px'
   isMobile = null

  constructor(public authService: AuthService, private deviceService: DeviceDetectorService) { }

  signOut() {
    this.authService.signOut()
  }

  navChanged(opened: boolean) {
    this.width = opened ? '100%' : '0px'
  }

  checkDevice() {
      this.isMobile = this.deviceService.isMobile()
  }

  ngOnInit() {
    this.checkDevice()
  }
}
