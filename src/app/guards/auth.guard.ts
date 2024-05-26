import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map, retry } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  return toObservable(authStore.user).pipe(
    filter(user => user !== undefined && user !== null),
    map(user => {
      return true;

      // router.navigate(['home']);

      // return false;
    })
  );
  retry;
};
