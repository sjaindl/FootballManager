import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { UserStore } from '../standings/store/user.store';
import { isSignedInRequirement } from '../utils/is-signed-in-requirement';

export const usersGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userStore = inject(UserStore);
  console.warn('userStore');

  return isSignedInRequirement(toObservable(userStore.users), users => {
    if (users.length > 0) {
      return true;
    }
    userStore.loadUsers();
    return false;
  });

  // return toObservable(userStore.users).pipe(
  //   map(users => {
  //     if (users.length > 0) {
  //       return true;
  //     }
  //     userStore.loadUsers();
  //     return false;
  //   }),
  //   filter(canActivate => {
  //     return canActivate;
  //   })
  // );
};
