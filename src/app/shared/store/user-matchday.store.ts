import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  distinctUntilChanged,
  forkJoin,
  map,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { ConfigStore } from '../../lineup/store/config.store';
import { SnackbarService } from '../../service/snackbar.service';
import { UserData } from '../userdata';

export type UserToMatchdays = Record<string, UserData[]>;

interface UserToMatchdaysState {
  usersToMatchdays: UserToMatchdays | undefined;
}

const initialState: UserToMatchdaysState = {
  usersToMatchdays: undefined,
};

export const UserMatchdayStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userMatchdaysStore'),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      configStore = inject(ConfigStore),
      snackBarService = inject(SnackbarService)
    ) => ({
      load: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getUsers().pipe(
              tapResponse({
                next: users => {
                  forkJoin(
                    users.map(user =>
                      firebaseService.getUserMatchdayData(user.uid).pipe(
                        take(1),
                        map(userData => ({ user: user, userData: userData }))
                      )
                    )
                  )
                    .pipe(
                      tap(values => {
                        const map: UserToMatchdays = {};
                        values.forEach(userDataWrapper => {
                          map[userDataWrapper.user.uid] =
                            userDataWrapper.userData.filter(currentUserData => {
                              return currentUserData.id.startsWith(
                                configStore.season()
                              );
                            });
                        });
                        patchState(store, state => {
                          state.usersToMatchdays = map;
                          return state;
                        });
                      }),
                      take(1)
                    )
                    .subscribe();
                },
                error: () => {
                  snackBarService.open('Fehler beim Laden der Spieltage!');
                },
                finalize: () => {
                  coreStore.decreaseLoadingCount();
                },
              })
            );
          })
        )
      ),

      setUserMatchdayBet(
        matchday: string,
        uid: string,
        homeScore: number,
        awayScore: number
      ): void {
        firebaseService.saveUserMatchdayBet(matchday, homeScore, awayScore);

        patchState(store, state => {
          const days = state.usersToMatchdays ?? {};

          var userData = days[uid].find(data => {
            return data.id === matchday;
          });

          const userDataList = days[uid].filter(data => {
            return data.id !== matchday;
          });

          if (userData) {
            userData.homeScore = homeScore;
            userData.awayScore = awayScore;

            userDataList.push(userData);
            days[uid] = userDataList;

            state.usersToMatchdays = days;
          }

          snackBarService.open('Tipp gespeichert!');

          return state;
        });
      },
    })
  )
);
