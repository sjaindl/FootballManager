import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FirebaseUIModule,
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseuiAngularLibraryService,
} from 'firebaseui-angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 's11-home',
  standalone: true,
  imports: [FirebaseUIModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  isMobile = true;
  private sub: Subscription | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metaTagService: Meta,
    private titleService: Title,
    private deviceService: DeviceDetectorService,
    private authService: AuthService,
    firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService
  ) {
    firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();
  }

  ngOnInit() {
    this.checkDevice();

    this.titleService.setTitle('Fußball Manager: Home');
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'Spiele mit deinen Lieblingsspielern aus der Voitsberger Stammtischliga gegen deine Freunde, und erstelle deine persönliche Aufstellung.',
    });

    this.sub = this.route.params.subscribe(params => {
      console.log(params);

      if (params['logout'] == 'logout') {
        console.log('log out ..');
        this.authService.signOut();
        this.router.navigate(['home']);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  checkDevice() {
    this.isMobile = this.deviceService.isMobile();
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
}
