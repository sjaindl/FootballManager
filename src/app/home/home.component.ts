import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import {
  FirebaseUIModule,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseuiAngularLibraryService,
} from 'firebaseui-angular';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-home',
  standalone: true,
  imports: [
    FirebaseUIModule,
    AngularFireModule,
    AngularFireAuthModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    public authService: AuthService,
    firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  ) {
    firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
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
