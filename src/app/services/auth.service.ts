import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

    isSignedIn(): any {
        return this.angularFireAuth.auth.currentUser != null
    }

    signOut() {
      this.angularFireAuth.auth.signOut()
    }

    canActivate(): boolean {
      console.log(this.isSignedIn())
      if (!this.isSignedIn()) {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    }

    constructor(public angularFireAuth: AngularFireAuth, public router: Router) {
      angularFireAuth.auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("user signed in")
        } else {
          console.log("user signed out")
        }
      });
    }
}
