import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { MatchdayStore } from '../../admin/store/matchday.store';
import { noBetText } from '../../shared/constants';
import { S11Image } from '../../shared/image/image.component';
import { UserMatchdayStore } from '../../shared/store/user-matchday.store';
import { User } from '../../shared/user';
import { UserStore } from '../../standings/store/user.store';
import { BettingStore } from './bettings.store';

interface UserWithBets {
  image: S11Image;
  user: User;
  matchday: string;
  bet: string;
  homeScore: number | undefined;
  awayScore: number | undefined;
}

interface UserBetState {
  bets: UserWithBets[] | undefined;
}

const initialState: UserBetState = {
  bets: undefined,
};

export const UserBettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userBettingsStore'),

  withMethods(
    (
      store,
      bettingStore = inject(BettingStore),
      userStore = inject(UserStore),
      matchdayStore = inject(MatchdayStore),
      userMatchdayStore = inject(UserMatchdayStore)
    ) => ({
      calculateBets: () => {
        const usersMatchdaysObject = userMatchdayStore.usersToMatchdays();

        const nextBet = bettingStore.nextBet();

        const matchdays = (matchdayStore.matchdays() ?? []).map(
          matchDay => matchDay.id
        );
        if (nextBet && !matchdays.includes(nextBet.matchday)) {
          matchdays.push(nextBet.matchday);
        }

        const newMatchdayBets = matchdays
          .map(matchday => {
            const newBets = (userStore.users() ?? []).map(user => {
              const userMatchdays = usersMatchdaysObject
                ? usersMatchdaysObject[user.uid]
                : [];

              const userDataAtMatchday = userMatchdays.find(userData => {
                return userData.id === matchday;
              });

              if (userDataAtMatchday) {
                const homeScore = userDataAtMatchday.homeScore;
                const awayScore = userDataAtMatchday.awayScore;
                var bet = noBetText;
                if (homeScore !== undefined && awayScore !== undefined) {
                  bet = `${homeScore} : ${awayScore}`;
                }

                return {
                  image: {
                    ref: user.photoRef,
                    url: user.photoUrl,
                    alt: user.userName,
                  },
                  user: user,
                  matchday: matchday,
                  bet: bet,
                  homeScore: homeScore,
                  awayScore: awayScore,
                };
              } else {
                return {
                  image: {
                    ref: user.photoRef,
                    url: user.photoUrl,
                    alt: user.userName,
                  },
                  user: user,
                  matchday: matchday,
                  bet: noBetText,
                  homeScore: undefined,
                  awayScore: undefined,
                };
              }
            });

            return newBets;
          })
          .reduce((a, b) => a.concat(b), []);

        patchState(store, state => {
          state.bets = newMatchdayBets;
          return state;
        });
      },
    })
  )
);
