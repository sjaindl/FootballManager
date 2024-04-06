import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthStore } from '../auth/store/auth.store';
import { defaultFormation } from '../shared/formation';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authStore = inject(AuthStore);

  private isUserSignedIn: boolean;

  isSignedIn(): boolean {
    return this.isUserSignedIn;
  }

  signOut() {
    this.fireAuth.signOut();
  }

  constructor(
    private fireAuth: Auth,
    private firebaseService: FirebaseService
  ) {
    this.isUserSignedIn = fireAuth.currentUser != null;

    console.log('Current user: ' + fireAuth.currentUser);
    console.log('is signed in: ' + this.isUserSignedIn);

    fireAuth.onAuthStateChanged(user => {
      if (user) {
        firebaseService.getUser(user.uid).subscribe(dbUser => {
          const userName = dbUser?.userName ?? user.displayName ?? 'No Name';

          if (!dbUser) {
            firebaseService.setUserData(
              user.uid,
              userName,
              user.email ?? '',
              user.providerId,
              user.photoURL ?? '',
              '',
              defaultFormation,
              false
            );
          }

          const signedInUser = {
            uid: user.uid,
            userName: userName,
            email: user.email ?? '',
            providerId: user.providerId ?? '',
            photoUrl: user.photoURL ?? '',
            photoRef: dbUser?.photoRef ?? '',
            formation: dbUser?.formation ?? defaultFormation,
            isAdmin: dbUser?.isAdmin ?? false,
          };

          this.authStore.setUser(signedInUser);

          this.isUserSignedIn = true;
          console.log(
            'user signed in: ' + signedInUser.uid + ', ' + signedInUser.userName
          );
        });
      } else {
        this.isUserSignedIn = false;
        this.authStore.setUser(undefined);
        console.log('user signed out');
      }
    });
  }

  updateName(name: string): void {
    this.firebaseService.setUserName(name);
    this.authStore.updateName(name);
  }

  updatePhotoRef(photoRef: string): void {
    this.firebaseService.setUserPhotoRef(photoRef);
    this.authStore.updatePhotoRef(photoRef);
  }
}
