import { GoogleMapsModule } from '@angular/google-maps'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage'

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import 'hammerjs'

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
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
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { TeamComponent } from './team/team.component';
import { MarketComponent } from './market/market.component';
import { StandingComponent } from './standing/standing.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { AppRoutingModule } from './app-routing/app-routing.component';
import { FirebaseConfig } from './shared/firebase.config';
import { NewleagueDialogComponent } from './newleague.dialog/newleague.dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminareaComponent } from './adminarea/adminarea.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProfileComponent } from './profile/profile.component';

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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    TeamComponent,
    MarketComponent,
    StandingComponent,
    AboutusComponent,
    ContactComponent,
    FaqComponent,
    NewleagueDialogComponent,
    AdminareaComponent,
    PrivacyPolicyComponent,
    ProfileComponent
  ],
  entryComponents: [
    NewleagueDialogComponent
  ],
  imports: [
    GoogleMapsModule,
    BrowserModule.withServerTransition({appId: 'football-manager'}),
    BrowserAnimationsModule,
    // RouterModule.forRoot([
    //   { path: '', component: HomeComponent, pathMatch: 'full'},
    //   { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
    //   { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule'}
    // ]),
    TransferHttpCacheModule,
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
    // MatOptionModule,
    MatSnackBarModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    // AgmCoreModule.forRoot({
    //   apiKey: environment.googleMapsApiKey
    // }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
