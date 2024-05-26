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
import { PlayerStore } from '../lineup/store/player.store';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { PointsStore } from '../standings/store/points.store';
import { UserStore } from '../standings/store/user.store';
import { guardDependencyTwoLevel } from '../utils/guard-dependency';

export const pointsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerStore = inject(PlayerStore);
  const userBettingsStore = inject(UserBettingsStore);
  const bettingStore = inject(BettingStore);
  const userStore = inject(UserStore);
  const matchdayStore = inject(MatchdayStore);
  const userMatchdayStore = inject(UserMatchdayStore);
  const pointsStore = inject(PointsStore);

  const players = toObservable(playerStore.players).pipe(
    map(playersArray => playersArray.length > 0)
  );

  const bets = toObservable(bettingStore.bets).pipe(
    map(betsArray => betsArray.length > 0)
  );

  const users = toObservable(userStore.users).pipe(
    map(usersArray => usersArray.length > 0)
  );

  const matchdays = toObservable(matchdayStore.matchdays).pipe(
    map(matchdaysArray => matchdaysArray.length > 0)
  );

  const userMatchdays = toObservable(userMatchdayStore.usersToMatchdays).pipe(
    map(userMatchdaysObject =>
      userMatchdaysObject ? Object.keys(userMatchdaysObject).length > 0 : false
    )
  );

  const userBettings = toObservable(userBettingsStore.bets).pipe(
    map(matchdaysArray => matchdaysArray.length > 0)
  );

  return guardDependencyTwoLevel(
    [players, bets, users, matchdays, userMatchdays],
    [userBettings],
    toObservable(pointsStore.userWithPoints),
    userPoints => {
      console.warn('points', userPoints);
      if (userPoints !== undefined) {
        return true;
      }
      pointsStore.calculatePoints();
      return false;
    }
  );
};
