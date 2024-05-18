import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { UserBettingsStore } from '../betting-game/store/user-bettings.store';

export const userBettingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userBettingsStore = inject(UserBettingsStore);

  return toObservable(userBettingsStore.bets).pipe(
    map(bets => {
      if (bets.length > 0) {
        return true;
      }
      userBettingsStore.calculateBets();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
