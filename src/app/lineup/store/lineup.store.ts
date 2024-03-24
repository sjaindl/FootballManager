import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { CoreStore } from '../../core/store/core.store';
import { FirebaseService } from '../../service/firebase.service';
import {
  ChangePlayerRequestWrapper,
  Player,
  Position,
  attacker,
  defender,
  goalkeeper,
  midfielder,
} from '../../shared/common.model';
import {
  getUndefinedPlayer,
  isUndefinedPlayer,
} from '../../shared/common.utils';
import { Formation } from '../../shared/formation';
import { LinedUpPlayer } from '../../shared/lineup';
import { PlayerStore } from './player.store';

interface LineupState {
  formation: Formation | undefined;
  goalkeeper: Player;
  defenders: Player[];
  midfielders: Player[];
  attackers: Player[];
}

const initialState: LineupState = {
  formation: undefined,
  attackers: [],
  defenders: [],
  midfielders: [],
  goalkeeper: getUndefinedPlayer(goalkeeper),
};

function initArray(count: number, position: Position): Player[] {
  if (count === 0) return [];

  const players = Array(count);
  return initArrayFrom(players, 0, count, position);
}

function initArrayFrom(
  players: Player[],
  from: number,
  count: number,
  position: Position
): Player[] {
  for (let index = from; index < count; index++) {
    players[index] = getUndefinedPlayer(position);
  }

  return players;
}

function setLineUpState(
  players: Player[],
  linedUpPlayerIds: string[],
  state: LineupState,
  position: Position,
  neededPlayersForPosition: number
) {
  var lineUpCount = 0;

  linedUpPlayerIds.forEach(linedUpPlayerId => {
    let playerToAdd = players.find(player => {
      return linedUpPlayerId === player.playerId;
    });
    if (playerToAdd) {
      switch (position) {
        case 'Goalkeeper':
          break;

        case 'Defender':
          state.defenders.push(playerToAdd);
          lineUpCount++;
          break;
        case 'Midfielder':
          state.midfielders.push(playerToAdd);
          lineUpCount++;
          break;
        case 'Attacker':
          state.attackers.push(playerToAdd);
          lineUpCount++;
          break;
      }
    }
  });

  var players: Player[];
  switch (position) {
    case 'Goalkeeper':
      players = [state.goalkeeper];
      break;
    case 'Defender':
      players = state.defenders;
      break;
    case 'Midfielder':
      players = state.midfielders;
      break;
    case 'Attacker':
      players = state.attackers;
      break;
  }

  const missingPlayers = neededPlayersForPosition - lineUpCount;
  initArrayFrom(
    players,
    neededPlayersForPosition - missingPlayers,
    neededPlayersForPosition,
    position
  );
}

function addToLineUpIfDefined(
  linedUpPlayers: LinedUpPlayer[],
  players: Player[]
): void {
  // var index = 0;
  players.forEach(player => {
    if (!isUndefinedPlayer(player)) {
      linedUpPlayers.push({
        playerId: player.playerId,
        position: player.position,
        // index: index++,
      });
    }
  });
}

function setPlayer(
  selectedPlayers: Player[],
  maxNumOfPlayers: number,
  position: Position
) {
  const lineupRow: Partial<Player>[] = [...selectedPlayers];

  for (let num = selectedPlayers.length; num < maxNumOfPlayers; num++) {
    lineupRow.push(getUndefinedPlayer(position));
  }

  return lineupRow;
}

export const LineupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ defenders, midfielders, attackers }) => ({
    hasPlayers: computed(() => {
      return (
        defenders().length > 0 &&
        midfielders().length > 0 &&
        attackers().length > 0
      );
    }),
  })),

  withDevtools('lineupStore'),

  withMethods(
    (
      store,
      playerStore = inject(PlayerStore),
      coreStore = inject(CoreStore),
      firebaseService = inject(FirebaseService),
      snackBar = inject(MatSnackBar)
    ) => {
      const containsDuplicates = (players: Player[]) => {
        let entries = new Set();
        players.forEach(player => {
          entries.add(player.playerId);
        });

        return entries.size != players.length;
      };

      return {
        setFormation(formation?: Formation): void {
          patchState(store, state => {
            state.goalkeeper = getUndefinedPlayer(goalkeeper);
            state.attackers = initArray(formation?.attack ?? 0, attacker);
            state.defenders = initArray(formation?.defense ?? 0, defender);
            state.midfielders = initArray(formation?.midfield ?? 0, midfielder);
            state.formation = formation;

            return { ...state };
          });
        },

        setPlayer(request: ChangePlayerRequestWrapper): void {
          patchState(store, state => {
            const position = request.position;
            const newPlayerId = request.newPlayerId;
            const oldPlayerId = request.oldPlayerId;

            const newPlayer =
              playerStore.playerMap()[newPlayerId] ??
              getUndefinedPlayer(position);

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
                    return getUndefinedPlayer(position);
                  }
                  return player;
                });
                console.warn(state.defenders);
                break;
              case 'Midfielder':
                state.midfielders = state.midfielders.map(player => {
                  if (player.playerId === oldPlayerId) {
                    return newPlayer;
                  }
                  if (player.playerId === newPlayerId) {
                    return getUndefinedPlayer(position);
                  }
                  return player;
                });
                break;
              case 'Attacker':
                state.attackers = state.attackers.map(player => {
                  if (player.playerId === oldPlayerId) {
                    return newPlayer;
                  }
                  if (player.playerId === newPlayerId) {
                    return getUndefinedPlayer(position);
                  }
                  return player;
                });
                break;
            }
            return { ...state };
          });
        },

        loadLineUp: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => coreStore.increaseLoadingCount()),
            switchMap(() => {
              return firebaseService.getLineUp().pipe(
                // take(1),
                tapResponse({
                  next: lineupData => {
                    patchState(store, state => {
                      state.defenders = [];
                      state.midfielders = [];
                      state.attackers = [];

                      let keeper = playerStore.players().find(player => {
                        return player.playerId === lineupData?.goalkeeper;
                      });

                      state.goalkeeper =
                        keeper ?? getUndefinedPlayer(goalkeeper);

                      setLineUpState(
                        playerStore.defenders(),
                        lineupData?.defenders ?? [],
                        state,
                        defender,
                        state.formation?.defense ?? 0
                      );

                      setLineUpState(
                        playerStore.midfielders(),
                        lineupData?.midfielders ?? [],
                        state,
                        midfielder,
                        state.formation?.midfield ?? 0
                      );

                      setLineUpState(
                        playerStore.attackers(),
                        lineupData?.attackers ?? [],
                        state,
                        attacker,
                        state.formation?.attack ?? 0
                      );

                      return state;
                    });
                  },
                  error: () =>
                    snackBar.open('Fehler beim Laden der Aufstellung!'), //TODO: Move to SnackbarService
                  finalize: () => {
                    coreStore.decreaseLoadingCount();
                  },
                }),
                take(1)
              );
            })
          )
        ),

        saveLineup() {
          if (
            containsDuplicates(store.defenders()) ||
            containsDuplicates(store.midfielders()) ||
            containsDuplicates(store.attackers())
          ) {
            console.error('Spieler dürfen nur einmal aufgestellt werden!');
            snackBar.open('Spieler dürfen nur einmal aufgestellt werden!');
          } else {
            firebaseService.setLineup(this.allLinedUpPlayers());
            snackBar.open('Aufstellung und Formation gespeichert!');
          }
        },

        allLinedUpPlayers(): LinedUpPlayer[] {
          var players: LinedUpPlayer[] = [];

          addToLineUpIfDefined(players, [store.goalkeeper()]);
          addToLineUpIfDefined(players, store.defenders());
          addToLineUpIfDefined(players, store.midfielders());
          addToLineUpIfDefined(players, store.attackers());

          return players;
        },
      };
    }
  )

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
