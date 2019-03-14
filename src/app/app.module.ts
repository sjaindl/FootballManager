import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieLawModule } from 'angular2-cookie-law'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MatListModule, MatSidenavModule, MatIconModule, MatToolbarModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatSnackBarModule, MatGridListModule, MatTableModule } from '@angular/material';
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
    PrivacyPolicyComponent
  ],
  entryComponents: [
    NewleagueDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'football-manager'}),
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full'},
      { path: 'lazy', loadChildren: './lazy/lazy.module#LazyModule'},
      { path: 'lazy/nested', loadChildren: './lazy/lazy.module#LazyModule'}
    ]),
    TransferHttpCacheModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatOptionModule,
    MatSnackBarModule,
    CookieLawModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
