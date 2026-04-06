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
import { distinctUntilChanged, pipe, switchMap, take, tap } from 'rxjs';
import { CoreStore } from '../../core/store/core.store';
import { FirebaseService } from '../../service/firebase.service';
import { SnackbarService } from '../../service/snackbar.service';
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
      snackBarService = inject(SnackbarService)
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
          patchState(store, {
            goalkeeper: getUndefinedPlayer(goalkeeper),
            attackers: initArray(formation?.attack ?? 0, attacker),
            defenders: initArray(formation?.defense ?? 0, defender),
            midfielders: initArray(formation?.midfield ?? 0, midfielder),
            formation,
          });
        },

        setPlayer(request: ChangePlayerRequestWrapper): void {
          const position = request.position;
          const newPlayerId = request.newPlayerId;
          const oldPlayerId = request.oldPlayerId;

          const newPlayer =
            playerStore.playerMap()[newPlayerId] ??
            getUndefinedPlayer(position);

          const mapPlayers = (players: Player[]) =>
            players.map(player => {
              if (player.playerId === oldPlayerId) return newPlayer;
              if (player.playerId === newPlayerId) return getUndefinedPlayer(position);
              return player;
            });

          switch (position) {
            case 'Goalkeeper':
              patchState(store, { goalkeeper: newPlayer });
              break;
            case 'Defender':
              patchState(store, state => ({ defenders: mapPlayers(state.defenders) }));
              break;
            case 'Midfielder':
              patchState(store, state => ({ midfielders: mapPlayers(state.midfielders) }));
              break;
            case 'Attacker':
              patchState(store, state => ({ attackers: mapPlayers(state.attackers) }));
              break;
          }
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
                    const tempState: LineupState = {
                      formation: store.formation(),
                      goalkeeper: getUndefinedPlayer(goalkeeper),
                      defenders: [],
                      midfielders: [],
                      attackers: [],
                    };

                    let keeper = playerStore.players()?.find(player => {
                      return player.playerId === lineupData?.goalkeeper;
                    });

                    tempState.goalkeeper =
                      keeper ?? getUndefinedPlayer(goalkeeper);

                    setLineUpState(
                      playerStore.defenders(),
                      lineupData?.defenders ?? [],
                      tempState,
                      defender,
                      tempState.formation?.defense ?? 0
                    );

                    setLineUpState(
                      playerStore.midfielders(),
                      lineupData?.midfielders ?? [],
                      tempState,
                      midfielder,
                      tempState.formation?.midfield ?? 0
                    );

                    setLineUpState(
                      playerStore.attackers(),
                      lineupData?.attackers ?? [],
                      tempState,
                      attacker,
                      tempState.formation?.attack ?? 0
                    );

                    patchState(store, {
                      goalkeeper: tempState.goalkeeper,
                      defenders: tempState.defenders,
                      midfielders: tempState.midfielders,
                      attackers: tempState.attackers,
                    });
                  },
                  error: () =>
                    snackBarService.open('Fehler beim Laden der Aufstellung!'), //TODO: Move to SnackbarService
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
            snackBarService.open(
              'Spieler dürfen nur einmal aufgestellt werden!'
            );
          } else {
            firebaseService.setLineup(this.allLinedUpPlayers());
            snackBarService.open('Aufstellung und Formation gespeichert!');
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
