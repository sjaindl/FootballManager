import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
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
                  users.forEach(user => {
                    return firebaseService
                      .getUserMatchdayLineups(user.uid)
                      .subscribe(lineups => {
                        patchState(store, state => {
                          const map = state.usersToMatchdays;
                          map[user.uid] = lineups;
                          state.usersToMatchdays = map;
                          return state;
                        });
                      });
                  });
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
