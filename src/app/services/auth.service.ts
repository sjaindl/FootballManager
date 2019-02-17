import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
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
        return this.angularFireAuth.auth.currentUser.uid
      }
      return ''
    }

    isSignedIn(): boolean {
        return this.angularFireAuth.auth.currentUser != null
    }

    isLeagueSelected(): boolean {
      console.log('Liga:')
      console.log(this.currentLeague)
      return this.currentLeague != null
    }

    signOut() {
      this.angularFireAuth.auth.signOut()
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
