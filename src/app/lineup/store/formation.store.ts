import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, take, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';
import { Formation } from '../../shared/formation';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CoreStore } from '../../core/store/core.store';

interface FormationState {
  formations: Formation[];
}

const initialState: FormationState = {
  formations: [],
};

export const FormationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBar = inject(MatSnackBar)
    ) => ({
      loadFormations: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getFormations().pipe(
              // take(1),
              tapResponse({
                next: formations => {
                  patchState(store, state => {
                    state.formations = formations;
                    return state;
                  });
                },
                error: () => snackBar.open('Fehler beim Laden der Formation!'), //TODO: Move to SnackbarService
                finalize: () => coreStore.decreaseLoadingCount(),
              }),
              take(1)
            );
          })
        )
      ),
    })
  )
);
