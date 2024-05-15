import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { CoreStore } from '../../core/store/core.store';
import { FirebaseService } from '../../service/firebase.service';
import { SnackbarService } from '../../service/snackbar.service';
import { Bet, sortBetsByMatchday } from '../../shared/bet';

interface UserBetState {
  bets: Bet[];
}

const initialState: UserBetState = {
  bets: [],
};

export const UserBettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('userBettingsStore'),

  withComputed(({ bets }) => ({
    nextBet: computed(() => {
      return bets().length === 0 ? undefined : bets()[bets().length - 1];
    }),
  })),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBarService = inject(SnackbarService)
    ) => ({
      loadBets: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getBets().pipe(
              tapResponse({
                next: bets => {
                  const betsList = bets ?? [];

                  patchState(store, state => {
                    state.bets = betsList.sort(sortBetsByMatchday);
                    return state;
                  });
                },
                error: () =>
                  snackBarService.open('Fehler beim Laden der Tipps!'),
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
