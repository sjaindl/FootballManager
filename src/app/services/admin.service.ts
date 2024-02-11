import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate {

  constructor(public angularFireAuth: Auth, public router: Router, public authService: AuthService) { }

  canActivate(): boolean {
     if (!this.isAdmin()) {
      this.router.navigate(['home'])
      return false
    }
    return true
  }

  isAdmin(): boolean {
    return this.angularFireAuth.currentUser != null &&
      (this.angularFireAuth.currentUser.uid == '2mHNemIdHPMt8hKurmdgE2gr5sk2' ||
    this.angularFireAuth.currentUser.uid == '5DMNsrphy5h7A4HKBb6xsX30YUt1') &&
    this.authService.isLeagueSelected()
  }
}
