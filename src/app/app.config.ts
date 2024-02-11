import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { FirebaseOptions } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
import { FirebaseConfig } from '../app/shared/firebase.config';
import { routes } from './app.routes';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      scopes: ['profile', 'email'],
      customParameters: {
        auth_type: 'reauthenticate',
      },
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    },
    {
      scopes: ['public_profile', 'email'],
      customParameters: {
        auth_type: 'reauthenticate',
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: 'TODO: <your-tos-link>',
  privacyPolicyUrl: 'TODO: <your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

const firebaseOptions: FirebaseOptions = {
  apiKey: FirebaseConfig.apiKey,
  authDomain: FirebaseConfig.authDomain,
  databaseURL: FirebaseConfig.databaseURL,
  projectId: FirebaseConfig.projectId,
  storageBucket: FirebaseConfig.storageBucket,
  messagingSenderId: FirebaseConfig.messagingSenderId,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    // Firebase:
    importProvidersFrom(AngularFireModule.initializeApp(firebaseOptions)),
    AngularFireAuthModule,
    AngularFirestoreModule,
    importProvidersFrom(FirebaseUIModule.forRoot(firebaseUiAuthConfig)),
  ],
};
