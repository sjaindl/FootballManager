import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStore);

  return toObservable(authStore.user).pipe(
    map(user => {
      if (!user) {
        return false;
      }

      return user.isAdmin;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
