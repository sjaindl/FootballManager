import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../shared/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isUserSignedIn: boolean;

  user: User | null = null;

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
      if (user) {
        this.user = {
          uid: user.uid,
          userName: user.displayName ?? '',
          email: user.email ?? '',
          photoURL: user.photoURL ?? '',
        };

        this.isUserSignedIn = true;
        // User is signed in.
        console.log(
          'user signed in: ' + this.user.uid + ', ' + this.user.userName
        );
      } else {
        this.isUserSignedIn = false;
        console.log('user signed out');
      }
    });
  }
}
