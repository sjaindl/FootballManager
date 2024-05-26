import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  FirebaseUIModule,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseuiAngularLibraryService,
} from 'firebaseui-angular';
import { AuthStore } from '../auth/store/auth.store';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-firebase-wrapper',
  standalone: true,
  imports: [FirebaseUIModule, CommonModule],
  templateUrl: './firebase-wrapper.component.html',
  styleUrl: './firebase-wrapper.component.scss',
})
export class FirebaseWrapperComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // readonly configStore = inject(ConfigStore);

  isMobile = true;
  // private sub: Subscription | undefined;
  isSignedIn = this.authStore.isSignedIn;

  constructor(
    private metaTagService: Meta,
    private titleService: Title,
    private authService: AuthService,
    firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  ) {
    firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();

    computed(() => this.authStore.user);
  }

  ngOnInit() {
    this.titleService.setTitle('Fußball Manager: Home');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Spiele mit deinen Lieblingsspielern aus der Voitsberger Stammtischliga gegen deine Freunde, und erstelle deine persönliche Aufstellung.',
    });
  }

  // ngOnDestroy() {
  //   this.sub?.unsubscribe();
  // }

  // isSignedIn(): boolean {
  //   return this.authStore.user();
  // }

  successCallback(event: FirebaseUISignInSuccessWithAuthResult) {
    console.log(event);
  }

  errorCallback(error: FirebaseUISignInFailure) {
    console.log(error);
  }

  uiShownCallback() {
    console.log('UI shown');
  }
}
