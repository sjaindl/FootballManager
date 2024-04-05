import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FirebaseUIModule,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
} from 'firebaseui-angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthStore } from '../auth/store/auth.store';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-home',
  standalone: true,
  imports: [FirebaseUIModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  isMobile = true;

  constructor(
    private deviceService: DeviceDetectorService,
    private authService: AuthService // firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  ) {
    //firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit() {
    this.checkDevice();
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
  }

  isSignedIn(): boolean {
    return this.authService.isSignedIn();
  }

  successCallback(event: FirebaseUISignInSuccessWithAuthResult) {
    console.log(event);
  }

  errorCallback(error: FirebaseUISignInFailure) {
    console.log(error);
  }

  uiShownCallback() {
    console.log('UI shown');
  }

  logout() {
    this.authService.signOut();
  }
}
