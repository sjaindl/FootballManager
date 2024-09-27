import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { MatchdayStore } from '../admin/store/matchday.store';
import { BettingStore } from '../betting-game/store/bettings.store';
import { UserBettingsStore } from '../betting-game/store/user-bettings.store';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { UserStore } from '../standings/store/user.store';
import { guardDependency } from '../utils/guard-dependency';

export const userBettingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userBettingsStore = inject(UserBettingsStore);
  const bettingStore = inject(BettingStore);
  const userStore = inject(UserStore);
  const matchdayStore = inject(MatchdayStore);
  const userMatchdayStore = inject(UserMatchdayStore);

  const bets = toObservable(bettingStore.bets).pipe(
    map(betsArray => betsArray !== undefined)
  );

  const users = toObservable(userStore.users).pipe(
    map(usersArray => usersArray !== undefined)
  );

  const matchdays = toObservable(matchdayStore.matchdays).pipe(
    map(matchdaysArray => matchdaysArray !== undefined)
  );

  const userMatchdays = toObservable(userMatchdayStore.usersToMatchdays).pipe(
    map(userMatchdaysObject => userMatchdaysObject !== undefined)
  );

  return guardDependency(
    [bets, users, matchdays, userMatchdays],
    toObservable(userBettingsStore.bets),
    userBets => {
      console.warn('bets', userBets);
      if (userBets !== undefined) {
        return true;
      }
      userBettingsStore.calculateBets();
      return false;
    }
  );
};
