import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { SnackbarService } from '../../service/snackbar.service';
import { User } from '../../shared/user';

interface UserToMatchdaysState {
  users: User[] | undefined;
}

const initialState: UserToMatchdaysState = {
  users: undefined,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userStore'),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBarService = inject(SnackbarService)
    ) => ({
      loadUsers: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getUsers().pipe(
              tapResponse({
                next: users => {
                  patchState(store, state => {
                    state.users = users;
                    return state;
                  });
                },
                error: () => {
                  snackBarService.open('Fehler beim Laden der User!');
                },
                finalize: () => {
                  coreStore.decreaseLoadingCount();
                },
              })
              // take(1)
            );
          })
        )
      ),
    })
  )
);
