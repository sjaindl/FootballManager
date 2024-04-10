import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { UserStore } from '../standings/store/user.store';

export const usersGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userStore = inject(UserStore);

  return toObservable(userStore.users).pipe(
    map(users => {
      if (users.length > 0) {
        return true;
      }
      userStore.loadUsers();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
