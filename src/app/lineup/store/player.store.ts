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

import { Storage, StorageReference, ref } from '@angular/fire/storage';
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

  withComputed(({ players }, storage = inject(Storage)) => ({
    playerMap: computed(() => {
      const playerMap: Record<string, Player> = {};
      players().forEach(player => (playerMap[player.playerId] = player));
      return playerMap;
    }),

    playerImageRefs: computed(() => {
      const playerImageMap: Record<string, StorageReference> = {};
      players().forEach(
        player =>
          (playerImageMap[player.playerId] = ref(storage, player.imageRef))
      );
      return playerImageMap;
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
