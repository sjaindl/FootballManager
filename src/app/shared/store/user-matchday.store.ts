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
import { SnackbarService } from '../../service/snackbar.service';
import { LineupData } from '../lineupdata';

export type UserToMatchdays = Record<string, LineupData[]>;

interface UserToMatchdaysState {
  usersToMatchdays: UserToMatchdays;
}

const initialState: UserToMatchdaysState = {
  usersToMatchdays: {},
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
                      firebaseService.getUserMatchdayLineups(user.uid).pipe(
                        take(1),
                        map(lineups => ({ user: user, lineups: lineups }))
                      )
                    )
                  )
                    .pipe(
                      tap(values => {
                        const map: UserToMatchdays = {};
                        values.forEach(lineupsWrapper => {
                          map[lineupsWrapper.user.uid] = lineupsWrapper.lineups;
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
    })
  )
);
