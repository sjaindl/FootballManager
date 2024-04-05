import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, map, pipe, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { Player } from '../../shared/common.model';
import { Matchday } from '../../shared/matchday';

export interface PlayerWithMatchDay {
  player: Player;
  matchday: Matchday;
}

interface MatchdayState {
  matchdays: PlayerWithMatchDay[];
}

const initialState: MatchdayState = {
  matchdays: [],
};

export const MatchdayStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('matchdayStore'),

  withComputed(({ matchdays }) => ({
    matchdayKeys: computed(() => {
      const keys: Set<string> = new Set();
      matchdays().forEach(matchDay => {
        keys.add(matchDay.matchday.id);
      });
      return Array.from(keys);
    }),
    mapByMatchDay: computed(() => {
      const matchdayMap: Map<string, PlayerWithMatchDay[]> = new Map();
      matchdays().forEach(matchDay => {
        const days = matchdayMap.get(matchDay.matchday.id) ?? [];
        days.push(matchDay);
        matchdayMap.set(matchDay.matchday.id, days);
      });
      return matchdayMap;
    }),
  })),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore)
    ) => ({
      setPlayerMatchdays(matchdays: PlayerWithMatchDay[]): void {
        firebaseService.setPlayerMatchdays(matchdays);

        patchState(store, state => {
          state.matchdays = matchdays;
          return state;
        });
      },

      setUserMatchdayLineups(matchday: string): void {
        firebaseService.setUserMatchdayLineup(matchday);
        // TODO: add to state?
      },

      loadPlayerMatchdays: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getPlayers().pipe(
              map(players => {
                players.forEach(player => {
                  firebaseService
                    .getPlayerMatchdays(player.playerId)
                    .subscribe(matchdays => {
                      patchState(store, state => {
                        matchdays.forEach(matchDay => {
                          const day = {
                            matchday: matchDay,
                            player: player,
                          };
                          state.matchdays.push(day);
                        });

                        return state;
                      });
                    });
                });
              })
            );
          })
        )
      ),
    })
  )
);
