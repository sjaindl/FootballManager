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
import { ConfigStore } from '../../lineup/store/config.store';
import { FirebaseService } from '../../service/firebase.service';
import { SnackbarService } from '../../service/snackbar.service';
import { Bet, sortBetsByMatchday } from '../../shared/bet';

interface BetState {
  bets: Bet[] | undefined;
}

const initialState: BetState = {
  bets: undefined,
};

export const BettingStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('bettingStore'),

  withComputed(({ bets }) => ({
    nextBet: computed(() => {
      const betsOptional = bets();
      return betsOptional === undefined
        ? undefined
        : betsOptional[betsOptional.length - 1];
    }),
  })),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      configStore = inject(ConfigStore),
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
                    state.bets = betsList
                      .filter((bet: Bet) => {
                        const season = configStore.season();

                        return (
                          season !== undefined &&
                          bet.matchday.startsWith(season)
                        );
                      })
                      .sort(sortBetsByMatchday);
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

      saveBet(matchday: string, homeScore: number, awayScore: number) {
        const bet = store.bets()?.find(bet => {
          return bet.matchday === matchday;
        });

        if (!bet) return;

        bet.resultScoreHome = homeScore;
        bet.resultScoreAway = awayScore;

        const betsList = store.bets()?.filter(bet => {
          return bet.matchday !== matchday;
        });

        betsList?.push(bet);

        firebaseService.setBet(
          matchday,
          homeScore,
          awayScore,
          bet.home,
          bet.away
        );

        patchState(store, state => {
          state.bets = betsList?.sort(sortBetsByMatchday);
          snackBarService.open('Ergebnis gespeichert!');
          return state;
        });
      },
    })
  )
);
