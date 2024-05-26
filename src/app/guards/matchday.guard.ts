import { inject } from '@angular/core';
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

  return toObservable(matchdayStore.matchdays).pipe(
    map(matchdays => {
      if (matchdays) {
        return true;
      }
      matchdayStore.loadMatchdays();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
