import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  NgcCookieConsentConfig,
  provideNgcCookieConsent,
} from 'ngx-cookieconsent';
import { routes } from './app.routes';

const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'starting-eleven-2019.firebaseapp.com',
  },
  palette: {
    popup: {
      background: '#c2185b',
    },
    button: {
      background: '#f1d600',
    },
  },
  theme: 'edgeless',
  type: 'opt-out',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNgcCookieConsent(cookieConfig),
  ],
};
