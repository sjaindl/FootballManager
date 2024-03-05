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
import { distinctUntilChanged, pipe, switchMap, take, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';
import { Player } from '../../shared/common.model';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CoreStore } from '../../core/store/core.store';

interface PlayerState {
  players: Player[];
}

const initialState: PlayerState = {
  players: [],
};

export const PlayerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ players }) => ({
    playerMap: computed(() => {
      const playerMap: Record<string, Player> = {};
      players().forEach(player => (playerMap[player.playerId] = player));
      return playerMap;
    }),
  })),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBar = inject(MatSnackBar)
    ) => ({
      loadPlayers: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getPlayers().pipe(
              // take(1),
              tapResponse({
                next: players => {
                  patchState(store, state => {
                    state.players = players;
                    return state;
                  });
                },
                error: () => snackBar.open('Fehler beim Laden der Spieler!'), //TODO: Move to SnackbarService
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
