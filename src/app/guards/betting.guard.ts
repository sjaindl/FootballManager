import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { BettingStore } from '../betting-game/store/bettings.store';

export const bettingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const bettingStore = inject(BettingStore);

  return toObservable(bettingStore.bets).pipe(
    map(bets => {
      if (bets.length > 0) {
        return true;
      }
      bettingStore.loadBets();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
