import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { UserLineupStore } from '../shared/store/user-lineup.store';

export const userLineupGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userLineupStore = inject(UserLineupStore);

  const value = computed(() => {
    return Object.keys(userLineupStore.userToLineup()).length > 0;
  });

  return toObservable(value).pipe(
    map(fulfillsRequirements => {
      if (fulfillsRequirements) {
        return true;
      }

      if (Object.keys(userLineupStore.userToLineup()).length === 0) {
        userLineupStore.load();
      }
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
