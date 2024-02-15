import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseUIModule } from 'firebaseui-angular';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-home',
  standalone: true,
  imports: [FirebaseUIModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    public authService: AuthService
  ) // firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  {
    //firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  isSignedIn(): boolean {
    return this.authService.isSignedIn();
  }

  successCallback(event: any) {
    console.log(event);
  }

  errorCallback(error: any) {
    console.log(error);
  }

  uiShownCallback() {
    console.log('UI shown');
  }

  logout() {
    this.authService.signOut();
  }
}
