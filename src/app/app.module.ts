import { GoogleMapsModule } from '@angular/google-maps'

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import 'hammerjs'

//import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
//import { TransferHttpCacheModule } from '@nguniversal/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http'
import { LocationStrategy, HashLocationStrategy } from '@angular/common'

import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTableModule } from '@angular/material/table'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatMenuModule } from '@angular/material/menu'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing/app-routing.component';
import { FirebaseConfig } from './shared/firebase.config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
/*
const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'starting-eleven-2019.firebaseapp.com'
  },
  palette: {
    popup: {
      background: '#c2185b'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'opt-out'
}
*/

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    ProfileComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'football-manager'}),
    BrowserAnimationsModule,
   
    //TransferHttpCacheModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    //NgcCookieConsentModule.forRoot(cookieConfig),
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,

    provideFirebaseApp(() => initializeApp( environment.firebase )),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage() ),

    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxAuthFirebaseUIModule.forRoot({
      apiKey: FirebaseConfig.apiKey,
      authDomain: FirebaseConfig.authDomain,
      databaseURL: FirebaseConfig.databaseURL,
      projectId: FirebaseConfig.projectId,
      storageBucket: FirebaseConfig.storageBucket,
      messagingSenderId: FirebaseConfig.messagingSenderId
  }),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
