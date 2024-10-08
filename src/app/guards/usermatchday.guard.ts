import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';

export const userMatchdayGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userMatchdayStore = inject(UserMatchdayStore);

  const value = computed(() => {
    const matchDays = userMatchdayStore.usersToMatchdays();
    return matchDays !== undefined && Object.keys(matchDays).length > 0;
  });

  return toObservable(value).pipe(
    map(fulfillsRequirements => {
      if (fulfillsRequirements) {
        return true;
      }

      const matchDays = userMatchdayStore.usersToMatchdays();
      if (matchDays !== undefined && Object.keys(matchDays).length === 0) {
        userMatchdayStore.load();
      }
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
