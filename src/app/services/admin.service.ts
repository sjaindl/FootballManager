import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate {

  constructor(public angularFireAuth: AngularFireAuth, public router: Router, public authService: AuthService) { }

  canActivate(): boolean {
     if (!this.isAdmin()) {
      this.router.navigate(['home'])
      return false
    }
    return true
  }

  isAdmin(): boolean {
    return this.angularFireAuth.auth.currentUser != null &&
      (this.angularFireAuth.auth.currentUser.uid == '2mHNemIdHPMt8hKurmdgE2gr5sk2' ||
    this.angularFireAuth.auth.currentUser.uid == '5DMNsrphy5h7A4HKBb6xsX30YUt1') &&
    this.authService.isLeagueSelected()
  }
}
