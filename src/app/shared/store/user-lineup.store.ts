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

export type UserToLineup = Record<string, LineupData>;

interface UserToLineupState {
  userToLineup: UserToLineup;
}

const initialState: UserToLineupState = {
  userToLineup: {},
};

export const UserLineupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userLineupStore'),

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
                      firebaseService.getLineUpOfUser(user.uid).pipe(
                        take(1),
                        map(lineup => ({ user: user, lineup: lineup }))
                      )
                    )
                  )
                    .pipe(
                      tap(values => {
                        const map: UserToLineup = {};
                        values.forEach(lineupsWrapper => {
                          if (lineupsWrapper.lineup) {
                            map[lineupsWrapper.user.uid] =
                              lineupsWrapper.lineup;
                          }
                        });

                        patchState(store, state => {
                          state.userToLineup = map;
                          return state;
                        });
                      })
                      //take(1)
                    )
                    .subscribe();
                },
                error: () => {
                  snackBarService.open(
                    'Fehler beim Laden der User-Aufstellungen!'
                  );
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
