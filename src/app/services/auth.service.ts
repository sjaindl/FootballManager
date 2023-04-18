import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
// import * as firebase from 'firebase/app';
import { CanActivate, Router } from '@angular/router';
import { League } from '../shared/League';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

    public currentLeague: League

    userId(): string {
      if (this.isSignedIn()) {
        return this.angularFireAuth.currentUser.uid
      }
      return ''
    }

    isSignedIn(): boolean {
        return this.angularFireAuth.currentUser != null
    }

    isLeagueSelected(): boolean {
      return this.currentLeague != null
    }

    signOut() {
      this.angularFireAuth.signOut()
      this.currentLeague = null
    }

    canActivate(): boolean {
      console.log(this.isSignedIn())
      console.log(this.isLeagueSelected())
      
      if (!this.isSignedIn() || !this.isLeagueSelected()) {
        this.router.navigate(['home'])
        return false
      }
      return true
    }

    constructor(public angularFireAuth: Auth, public router: Router) {
      angularFireAuth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("user signed in")
        } else {
          console.log("user signed out")
        }
      });
    }
}
