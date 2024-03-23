import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FirebaseUIModule,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
} from 'firebaseui-angular';
import { AuthStore } from '../auth/store/auth.store';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-home',
  standalone: true,
  imports: [FirebaseUIModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly authStore = inject(AuthStore);

  constructor(
    public authService: AuthService // firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  ) {
    //firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
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
