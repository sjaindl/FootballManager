import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { MatchdayStore } from '../../admin/store/matchday.store';
import { CoreStore } from '../../core/store/core.store';
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
  bets: UserWithBets[];
}

const initialState: UserBetState = {
  bets: [],
};

export const UserBettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userBettingsStore'),

  // withComputed(({ bets }) => ({
  //   nextBet: computed(() => {
  //     return bets().length === 0 ? undefined : bets()[bets().length - 1];
  //   }),
  // })),

  // withComputed(({ bets }) => ({
  //   matchdayKeys: computed(() => matchdays().map(matchDay => matchDay.id)),

  //   nextMatchday: computed(() => {
  //     const matchDayKeys = matchdays().map(matchDay => matchDay.id);
  //     const lastMatchday = matchDayKeys[matchDayKeys.length - 1];
  //     if (!lastMatchday) {
  //       return currentSeason + '_1';
  //     }

  //     const index = lastMatchday.lastIndexOf('_');
  //     const lastMatchdayNum = Number(lastMatchday.substring(index + 1));
  //     const nextMatchday = currentSeason + '_' + (lastMatchdayNum + 1);
  //     return nextMatchday;
  //   }),
  // })),

  withMethods(
    (
      store,
      bettingStore = inject(BettingStore),
      coreStore = inject(CoreStore),
      userStore = inject(UserStore),
      matchdayStore = inject(MatchdayStore),
      userMatchdayStore = inject(UserMatchdayStore)
    ) => ({
      calculateBets: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            const usersMatchdays = userMatchdayStore.usersToMatchdays();
            const nextBet = bettingStore.nextBet();

            const matchdays = matchdayStore
              .matchdays()
              .map(matchDay => matchDay.id);
            if (nextBet) {
              matchdays.push(nextBet.matchday);
            }

            return matchdays.map(matchday => {
              userStore.users().forEach(user => {
                const userMatchdays = usersMatchdays[user.uid];

                const userDataAtMatchday = userMatchdays.find(userData => {
                  return userData.id === matchday;
                });

                if (userDataAtMatchday) {
                  const homeScore = userDataAtMatchday.homeScore;
                  const awayScore = userDataAtMatchday.awayScore;
                  var bet = noBetText;
                  if (homeScore != undefined && awayScore != undefined) {
                    bet = `${homeScore} : ${awayScore}`;
                  }

                  patchState(store, state => {
                    state.bets.push({
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
                    });
                    return state;
                  });
                } else {
                  patchState(store, state => {
                    state.bets.push({
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
                    });
                    return state;
                  });
                }
              });
            });
          })
        )
      ),
    })
  )
);
