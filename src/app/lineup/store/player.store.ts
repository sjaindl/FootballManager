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
import {
  Player,
  attacker,
  defender,
  goalkeeper,
  midfielder,
} from '../../shared/common.model';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { Storage, StorageReference, ref } from '@angular/fire/storage';
import { CoreStore } from '../../core/store/core.store';
import { SnackbarService } from '../../service/snackbar.service';
import { ConfigStore } from './config.store';

interface PlayerState {
  players: Player[] | undefined;
}

export interface MatchdayWithPoints {
  matchday: string;
  points: number;
}

export const sortMatchdayWithPointsByMatchday = (
  first: MatchdayWithPoints,
  second: MatchdayWithPoints
) => {
  const firstMatchday = first.matchday;
  const secondMatchday = second.matchday;

  const firstMatchdayNum = parseInt(firstMatchday.split('_')[1], 10);
  const secondMatchdayNum = parseInt(secondMatchday.split('_')[1], 10);

  if (firstMatchdayNum > secondMatchdayNum) return 1;
  if (firstMatchdayNum < secondMatchdayNum) return -1;
  else return 0;
};

const initialState: PlayerState = {
  players: undefined,
};

export const PlayerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('playerStore'),

  withComputed(
    (
      { players },
      storage = inject(Storage),
      configStore = inject(ConfigStore)
    ) => ({
      playerMap: computed(() => {
        const playerMap: Record<string, Player> = {};
        players()?.forEach(player => (playerMap[player.playerId] = player));
        return playerMap;
      }),

      playerImageRefs: computed(() => {
        const playerImageMap: Record<string, StorageReference> = {};
        players()?.forEach(
          player =>
            (playerImageMap[player.playerId] = ref(storage, player.imageRef))
        );
        return playerImageMap;
      }),

      goalkeepers: computed(() => {
        const goalkeepers: Player[] = [];
        players()?.forEach(player => {
          if (player.position === goalkeeper && player.active) {
            goalkeepers.push(player);
          }
        });

        return goalkeepers;
      }),

      defenders: computed(() => {
        const defenders: Player[] = [];
        players()?.forEach(player => {
          if (player.position === defender && player.active) {
            defenders.push(player);
          }
        });

        return defenders;
      }),

      midfielders: computed(() => {
        const midfielders: Player[] = [];
        players()?.forEach(player => {
          if (player.position === midfielder && player.active) {
            midfielders.push(player);
          }
        });

        return midfielders;
      }),

      attackers: computed(() => {
        const attackers: Player[] = [];
        players()?.forEach(player => {
          if (player.position === attacker && player.active) {
            attackers.push(player);
          }
        });

        return attackers;
      }),

      matchdayPoints: computed(() => {
        const playerMatchdayPoints: Record<string, MatchdayWithPoints[]> = {};

        players()?.forEach(player => {
          const matchdaysWithPoints: MatchdayWithPoints[] = [];
          Object.entries(player.points).forEach(
            ([matchDayKey, pointsOfMatchDay]) => {
              const matchdayWithPoints: MatchdayWithPoints = {
                matchday: matchDayKey,
                points: pointsOfMatchDay,
              };

              const season = configStore.season();
              if (season !== undefined) {
                if (matchDayKey.startsWith(season)) {
                  matchdaysWithPoints.push(matchdayWithPoints);
                }
              }
            }
          );

          playerMatchdayPoints[player.playerId] = matchdaysWithPoints;
        });

        return playerMatchdayPoints;
      }),

      totalPoints: computed(() => {
        const playerTotalPoints: Record<string, number> = {};
        players()?.forEach(player => {
          const season = configStore.season();
          if (season !== undefined) {
            const points = Object.keys(player.points).filter(key =>
              key.startsWith(season)
            );

            const totalPoints = points.reduce(
              (sum, key) => sum + player.points[key],
              0
            );

            playerTotalPoints[player.playerId] = totalPoints;
          }
        });

        return playerTotalPoints;
      }),
    })
  ),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      snackBarService = inject(SnackbarService)
    ) => ({
      loadPlayers: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getPlayers(false).pipe(
              // take(1),
              tapResponse({
                next: players => {
                  patchState(store, state => {
                    var mapped: Player[] = players.map(player => {
                      return {
                        playerId: player.playerId,
                        active: player.active,
                        position: player.position,
                        name: player.name,
                        imageRef: player.imageRef,
                        points: player.points,
                        pointsCurrentRound: 0,
                      };
                    });
                    state.players = mapped;
                    return state;
                  });
                },
                error: () =>
                  snackBarService.open('Fehler beim Laden der Spieler!'),
                finalize: () => coreStore.decreaseLoadingCount(),
              }),
              take(1)
            );
          })
        )
      ),
      setPlayerMatchdays(
        players: Player[] | undefined,
        matchday: string
      ): void {
        patchState(store, state => {
          state.players = players;
          return state;
        });

        if (players) {
          firebaseService.setPlayerMatchdays(players, matchday);
        }
      },
      resetCurrentPoints(): void {
        patchState(store, state => {
          const curPlayers = state.players ?? [];
          state.players = curPlayers.map(player => {
            return {
              playerId: player.playerId,
              active: player.active,
              name: player.name,
              position: player.position,
              imageRef: player.imageRef,
              points: player.points,
              pointsCurrentRound: 0,
            };
          });
          return state;
        });
      },
    })
  )
);
