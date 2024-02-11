import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { getAuth, provideAuth } from '@angular/fire/auth';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// import { initializeFirestore, provideFirestore } from '@angular/fire/firestore';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';
// import { getFunctions, provideFunctions } from '@angular/fire/functions';
// import { getMessaging, provideMessaging } from '@angular/fire/messaging';
// import { getPerformance, providePerformance } from '@angular/fire/performance';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { environment } from './environment';

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

// const firebaseOptions: FirebaseOptions = {
//   apiKey: FirebaseConfig.apiKey,
//   authDomain: FirebaseConfig.authDomain,
//   databaseURL: FirebaseConfig.databaseURL,
//   projectId: FirebaseConfig.projectId,
//   storageBucket: FirebaseConfig.storageBucket,
//   messagingSenderId: FirebaseConfig.messagingSenderId,
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    // Firebase:
    // importProvidersFrom([
    //   AngularFireModule.initializeApp(firebaseOptions),
    //   provideAuth(() => getAuth()),
    //   // provideFirestore(() => getFirestore('s11-test')),
    //   provideFirestore(() => {
    //     console.error('foooooooooooooooooooooooooooooooooooooooooooooo');
    //     const store = getFirestore('s11-test');
    //     console.warn(store);
    //     return store;
    //   }),
    //   provideStorage(() => getStorage()),
    // ]),

    importProvidersFrom([
      provideFirebaseApp(() => {
        return initializeApp(environment.firebaseConfig);
      }),
      provideAuth(() => getAuth()),
      // provideFirestore(() => {
      //   const app = getApp();
      //   const dbName = 's11-test';
      //   const providedFirestore = initializeFirestore(app, {}, dbName);
      //   return providedFirestore;
      // }),
      provideFirestore(() => getFirestore('s11-test')),
      provideStorage(() => getStorage()),
      FirebaseUIModule.forRoot(firebaseUiAuthConfig),
      // provideFirebaseUi()
    ]),

    // importProvidersFrom(provideAuth(() => getAuth())),
    // // provideFirestore(() => getFirestore('s11-test')),
    // importProvidersFrom(
    //   provideFirestore(() => {
    //     console.error('foooooooooooooooooooooooooooooooooooooooooooooo');
    //     const store = getFirestore('s11-test');
    //     console.warn(store);
    //     return store;
    //   })
    // ),
    // importProvidersFrom(provideStorage(() => getStorage())),

    // importProvidersFrom([
    //   provideFirebaseApp(() => initializeApp(environment.firebase)),
    //   provideAnalytics(() => getAnalytics()),
    //   provideAuth(() => getAuth()),
    //   provideFirestore(() => getFirestore()),
    //   provideFunctions(() => getFunctions()),
    //   provideMessaging(() => getMessaging()),
    //   providePerformance(() => getPerformance()),
    //   provideStorage(() => getStorage()),
    // ]),

    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // importProvidersFrom(FirebaseUIModule.forRoot(firebaseUiAuthConfig)),
  ],
};
