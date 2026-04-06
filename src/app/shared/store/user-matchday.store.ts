import { Injector, inject, runInInjectionContext } from '@angular/core';
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
      snackBarService = inject(SnackbarService),
      injector = inject(Injector)
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
                      runInInjectionContext(injector, () => firebaseService.getUserMatchdayData(user.uid)).pipe(
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
                              const season = configStore.season();
                              if (season === undefined) {
                                return false;
                              }

                              return currentUserData.id.startsWith(season);
                            });
                        });
                        patchState(store, { usersToMatchdays: map });
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

        const days = store.usersToMatchdays() ?? {};
        const userData = days[uid]?.find(data => data.id === matchday);

        if (userData) {
          const updatedUserData = { ...userData, homeScore, awayScore };
          const userDataList = days[uid].filter(data => data.id !== matchday);
          userDataList.push(updatedUserData);

          patchState(store, {
            usersToMatchdays: { ...days, [uid]: userDataList },
          });
        }

        snackBarService.open('Tipp gespeichert!');
      },
    })
  )
);
