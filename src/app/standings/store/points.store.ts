import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { MatchdayStore } from '../../admin/store/matchday.store';
import { CoreStore } from '../../core/store/core.store';
import { PlayerStore } from '../../lineup/store/player.store';
import { requiredNumOfPlayers } from '../../shared/constants';
import { S11Image } from '../../shared/image/image.component';
import { UserMatchdayStore } from '../../shared/store/user-matchday.store';
import { User } from '../../shared/user';
import { UserStore } from './user.store';

export interface UserWithPoints {
  image: S11Image | undefined;
  user: User | undefined;
  points: number;
  pointsLastRound: number;
}

export const sortPoints = (first: UserWithPoints, second: UserWithPoints) => {
  const firstPoints = first.points;
  const secondPoints = second.points;
  if (firstPoints > secondPoints) return -1;
  if (firstPoints < secondPoints) return 1;
  else return 0;
};

interface UserWithPointsState {
  userWithPoints: UserWithPoints[];
}

const initialState: UserWithPointsState = {
  userWithPoints: [],
};

export const PointsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('pointsStore'),

  withMethods(
    (
      store,
      coreStore = inject(CoreStore),
      matchdayStore = inject(MatchdayStore),
      playerStore = inject(PlayerStore),
      userStore = inject(UserStore),
      userMatchdayStore = inject(UserMatchdayStore)
    ) => {
      const pointsForPlayer = (playerId: string, matchday: string) => {
        const player = playerStore.players().find(player => {
          return player.playerId === playerId;
        });

        if (player) {
          const points = player.points[matchday];
          if (points === undefined || isNaN(points)) {
            return 0;
          }
          return points;
        }

        return 0;
      };

      return {
        calculatePoints: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => coreStore.increaseLoadingCount()),
            switchMap(() => {
              const usersMatchdays = userMatchdayStore.usersToMatchdays();

              return userStore.users().map(user => {
                var curPoints = 0;
                var pointsForRound = 0;
                const userMatchdays = usersMatchdays[user.uid];

                matchdayStore.matchdayKeys().map(matchday => {
                  const lineupAtMatchday = userMatchdays.find(lineup => {
                    return lineup.id === matchday;
                  });

                  if (lineupAtMatchday) {
                    pointsForRound = 0;

                    const points = pointsForPlayer(
                      lineupAtMatchday.goalkeeper,
                      matchday
                    );
                    curPoints += points;
                    pointsForRound += points;

                    lineupAtMatchday.defenders.forEach(playerId => {
                      const points = pointsForPlayer(playerId, matchday);
                      curPoints += points;
                      pointsForRound += points;
                    });

                    lineupAtMatchday.midfielders.forEach(playerId => {
                      const points = pointsForPlayer(playerId, matchday);
                      curPoints += points;
                      pointsForRound += points;
                    });

                    lineupAtMatchday.attackers.forEach(playerId => {
                      const points = pointsForPlayer(playerId, matchday);
                      curPoints += points;
                      pointsForRound += points;
                    });

                    const playersInFormation =
                      (lineupAtMatchday.goalkeeper !== '' ? 1 : 0) +
                      lineupAtMatchday.defenders.length +
                      lineupAtMatchday.midfielders.length +
                      lineupAtMatchday.attackers.length;

                    const penaltyForMissingPlayers =
                      requiredNumOfPlayers - playersInFormation;

                    curPoints -= penaltyForMissingPlayers;
                    pointsForRound -= penaltyForMissingPlayers;

                    console.log(matchday, points);
                  } else {
                    pointsForRound = -requiredNumOfPlayers;
                    curPoints -= requiredNumOfPlayers;
                  }
                });

                patchState(store, state => {
                  state.userWithPoints.push({
                    image: {
                      ref: user.photoRef,
                      url: user.photoUrl,
                      alt: user.userName,
                    },
                    user: user,
                    points: curPoints,
                    pointsLastRound: pointsForRound,
                  });

                  return state;
                });
              });
            })
          )
        ),
      };
    }
  )
);
