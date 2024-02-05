import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserSignedIn: boolean;

  uid: string | undefined = undefined;
  userName: string | undefined | null = null;

  isSignedIn(): boolean {
    return this.isUserSignedIn;
  }

  signOut() {
    this.angularFireAuth.signOut();
  }

  constructor(public angularFireAuth: AngularFireAuth) {
    this.isUserSignedIn = angularFireAuth.currentUser != null;

    console.log(angularFireAuth.currentUser);
    console.log(this.isUserSignedIn);

    angularFireAuth.onAuthStateChanged(user => {
      this.uid = user?.uid;
      this.userName = user?.displayName;

      if (user) {
        this.isUserSignedIn = true;
        // User is signed in.
        console.log('user signed in: ' + this.uid + ', ' + this.userName);
      } else {
        this.isUserSignedIn = false;
        console.log('user signed out');
      }
    });
  }
}
