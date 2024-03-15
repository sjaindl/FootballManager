import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ChangePlayerRequestWrapper, Player } from '../../shared/common.model';
import { getUndefinedPlayer } from '../../shared/common.utils';
import { Formation } from '../../shared/formation';
import { PlayerStore } from './player.store';

interface LineupState {
  formation?: Formation;
  goalkeeper: Player;
  defenders: Player[];
  midfielder: Player[];
  attacker: Player[];
}

const initialState: LineupState = {
  attacker: [getUndefinedPlayer(), getUndefinedPlayer()],
  defenders: [
    getUndefinedPlayer(),
    getUndefinedPlayer(),
    getUndefinedPlayer(),
    getUndefinedPlayer(),
  ],
  midfielder: [
    getUndefinedPlayer(),
    getUndefinedPlayer(),
    getUndefinedPlayer(),
    getUndefinedPlayer(),
  ],
  goalkeeper: getUndefinedPlayer(),
};

function setPlayer(selectedPlayers: Player[], maxNumOfPlayers: number) {
  const lineupRow: Partial<Player>[] = [...selectedPlayers];

  for (let num = selectedPlayers.length; num < maxNumOfPlayers; num++) {
    lineupRow.push(getUndefinedPlayer());
  }

  return lineupRow;
}

export const LineupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  // withComputed(({ user }) => ({
  //   userName: computed(() => {
  //     if (user) {
  //       return user()?.name ?? '';
  //     }
  //     return '';
  //   }),
  //   imageUrl: computed(() => {
  //     if (user) {
  //       return user()?.iconUrl ?? undefined;
  //     }
  //     return undefined;
  //   }),
  // })
  // ),

  withMethods((store, playerStore = inject(PlayerStore)) => ({
    setFormation(formation: Formation): void {
      patchState(store, state => {
        state.goalkeeper = getUndefinedPlayer();
        state.defenders = Array(formation.defense).fill(getUndefinedPlayer());
        state.midfielder = Array(formation.midfield).fill(getUndefinedPlayer());
        state.attacker = Array(formation.attack).fill(getUndefinedPlayer());

        return { ...state };
      });
    },

    setPlayer(request: ChangePlayerRequestWrapper): void {
      patchState(store, state => {
        // const playerStore = inject(PlayerStore);

        const position = request.position;
        const newPlayerId = request.newPlayerId;
        const oldPlayerId = request.oldPlayerId;

        const newPlayer =
          playerStore.playerMap()[newPlayerId] ?? getUndefinedPlayer();

        switch (position) {
          case 'Goalkeeper':
            state.goalkeeper = newPlayer;
            break;
          case 'Defender':
            state.defenders = state.defenders.map(player => {
              if (player.playerId === oldPlayerId) {
                return newPlayer;
              }
              if (player.playerId === newPlayerId) {
                return getUndefinedPlayer();
              }
              return player;
            });
            console.warn(state.defenders);
            break;
          case 'Midfielder':
            state.midfielder = state.midfielder.map(player => {
              if (player.playerId === oldPlayerId) {
                return newPlayer;
              }
              if (player.playerId === newPlayerId) {
                return getUndefinedPlayer();
              }
              return player;
            });
            break;
          case 'Attacker':
            state.attacker = state.attacker.map(player => {
              if (player.playerId === oldPlayerId) {
                return newPlayer;
              }
              if (player.playerId === newPlayerId) {
                return getUndefinedPlayer();
              }
              return player;
            });
            break;
        }
        return { ...state };
      });
    },
  }))

  // withMethods((store, booksService = inject(BooksService)) => ({
  //   /* ... */
  //   // 👇 Defining a method to load books by query.
  //   loadByQuery: rxMethod<string>(
  //     pipe(
  //       debounceTime(300),
  //       distinctUntilChanged(),
  //       tap(() => patchState(store, { isLoading: true })),
  //       switchMap((query) => {
  //         return booksService.getByQuery(query).pipe(
  //           tapResponse({
  //             next: (books) => patchState(store, { books }),
  //             error: console.error,
  //             finalize: () => patchState(store, { isLoading: false }),
  //           })
  //         );
  //       })
  //     )
  //   ),
  // }))
);
