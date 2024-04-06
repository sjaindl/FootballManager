import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import { routes } from './app.routes';
import { environment } from './environment';
import { firebaseUiAuthConfig } from './shared/firebaseauth.config';

const db = environment.production ? 's11-prod' : 's11-test';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withDebugTracing()
    ),
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    importProvidersFrom([
      provideFirebaseApp(() => {
        return initializeApp(environment.firebaseConfig);
      }),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore(db)),
      provideStorage(() => getStorage()),
      FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ]),
  ],
};
