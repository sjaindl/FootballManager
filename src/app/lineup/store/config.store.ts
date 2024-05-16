import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { CoreStore } from '../../core/store/core.store';
import { FirebaseService } from '../../service/firebase.service';
import { SnackbarService } from '../../service/snackbar.service';
import { Config } from '../../shared/config';

const initialState: Config = {
  freeze: true,
  bets: false,
};

export const ConfigStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('configStore'),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBarService = inject(SnackbarService)
    ) => ({
      loadConfig: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getConfig().pipe(
              tapResponse({
                next: config => {
                  patchState(store, state => {
                    state.freeze = config?.freeze ?? true;
                    state.bets = config?.bets ?? false;
                    return state;
                  });
                },
                error: () =>
                  snackBarService.open('Fehler beim Laden der Formation!'),
                finalize: () => {
                  coreStore.decreaseLoadingCount();
                },
              })
            );
          })
        )
      ),

      setConfig(freeze: boolean): void {
        patchState(store, state => {
          firebaseService.setConfig(freeze, state.bets ?? false);

          state.freeze = freeze;
          return state;
        });
      },
    })
  )
);
