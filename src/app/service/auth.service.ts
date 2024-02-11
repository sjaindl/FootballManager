import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
    this.foo.signOut();
  }

  constructor(public foo: Auth) {
    this.isUserSignedIn = foo.currentUser != null;

    console.log(foo.currentUser);
    console.log(this.isUserSignedIn);

    foo.onAuthStateChanged(user => {
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
