import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { MatchdayStore } from '../../admin/store/matchday.store';
import { BettingStore } from '../../betting-game/store/bettings.store';
import { UserBettingsStore } from '../../betting-game/store/user-bettings.store';
import { CoreStore } from '../../core/store/core.store';
import { PlayerStore } from '../../lineup/store/player.store';
import {
  pointsForCorrectTendence,
  pointsForExactBet,
  requiredNumOfPlayers,
} from '../../shared/constants';
import { S11Image } from '../../shared/image/image.component';
import { UserMatchdayStore } from '../../shared/store/user-matchday.store';
import { User } from '../../shared/user';
import { UserStore } from './user.store';

export interface UserWithPoints {
  image: S11Image | undefined;
  user: User | undefined;
  points: number;
  pointsLastRound: number;
  betPoints: number;
  betPointsLastRound: number;
}

enum Result {
  Win,
  Draw,
  Loss,
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
      userMatchdayStore = inject(UserMatchdayStore),
      bettingStore = inject(BettingStore),
      userBettingStore = inject(UserBettingsStore)
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

      const pointsForBet = (userId: string, matchday: string) => {
        const userBet = userBettingStore.bets().find(bet => {
          return bet.matchday === matchday && bet.user.uid === userId;
        });
        const userBetHome = userBet?.homeScore;
        const userBetAway = userBet?.awayScore;

        const result = bettingStore.bets().find(bet => {
          return bet.matchday === matchday;
        });
        const resultScoreHome = result?.resultScoreHome;
        const resultScoreAway = result?.resultScoreAway;

        var points = 0;

        if (
          resultScoreHome != undefined &&
          resultScoreAway != undefined &&
          userBetHome != undefined &&
          userBetAway != undefined
        ) {
          const isExactBet =
            resultScoreHome === userBetHome && resultScoreAway === userBetAway;

          const result =
            resultScoreHome > resultScoreAway
              ? Result.Win
              : resultScoreHome === resultScoreAway
              ? Result.Draw
              : Result.Loss;

          const bet =
            userBetHome > userBetAway
              ? Result.Win
              : userBetHome === userBetAway
              ? Result.Draw
              : Result.Loss;

          if (isExactBet) {
            points += pointsForExactBet;
          } else if (result === bet) {
            points += pointsForCorrectTendence;
          }
        }

        return points;
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
                var curBetPoints = 0;
                var betPointsForRound = 0;
                const userMatchdays = usersMatchdays[user.uid];

                matchdayStore.matchdayKeys().map(matchday => {
                  const lineupAtMatchday = userMatchdays.find(lineup => {
                    return lineup.id === matchday;
                  });

                  if (lineupAtMatchday) {
                    // Points for lineup at matchday
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
                    // Penalty points for missing lineup at matchday
                    pointsForRound = -requiredNumOfPlayers;
                    curPoints -= requiredNumOfPlayers;
                  }

                  // Additional points for matchday bet
                  const betPoints = pointsForBet(user.uid, matchday);
                  curPoints += betPoints;
                  pointsForRound += betPoints;
                  curBetPoints += betPoints;
                  betPointsForRound = betPoints;
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
                    betPoints: curBetPoints,
                    betPointsLastRound: betPointsForRound,
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
