import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { MatchdayStore } from '../admin/store/matchday.store';

export const matchdayGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const matchdayStore = inject(MatchdayStore);

  const value = computed(() => {
    return matchdayStore.matchdays().length > 0;
  });

  return toObservable(value).pipe(
    map(fulfillsRequirements => {
      if (fulfillsRequirements) {
        return true;
      }

      if (matchdayStore.matchdays().length === 0) {
        matchdayStore.loadMatchdays();
      }
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
