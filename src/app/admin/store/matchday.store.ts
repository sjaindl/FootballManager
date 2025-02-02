import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { ConfigStore } from '../../lineup/store/config.store';
import { Matchday } from '../../shared/matchday';

interface MatchdayState {
  matchdays: Matchday[] | undefined;
}

const initialState: MatchdayState = {
  matchdays: undefined,
};

export const MatchdayStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('matchdayStore'),

  withComputed(({ matchdays }, configStore = inject(ConfigStore)) => ({
    matchdayKeys: computed(() => {
      return matchdays()?.map(matchDay => matchDay.id);
    }),

    nextMatchday: computed(() => {
      const matchDays = matchdays();
      if (matchDays === undefined) {
        return configStore.season() + '_1';
      }

      const matchDayKeys = matchDays.map(matchDay => matchDay.id);
      const lastMatchday = matchDayKeys[matchDayKeys.length - 1];
      if (!lastMatchday) {
        return configStore.season() + '_1';
      }

      const index = lastMatchday.lastIndexOf('_');
      const lastMatchdayNum = Number(lastMatchday.substring(index + 1));
      const nextMatchday = configStore.season() + '_' + (lastMatchdayNum + 1);
      return nextMatchday;
    }),
  })),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      configStore = inject(ConfigStore)
    ) => ({
      loadMatchdays: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getMatchdays().pipe(
              tap(matchdays => {
                patchState(store, state => {
                  state.matchdays = matchdays.filter((matchday: Matchday) =>
                    matchday.id.startsWith(configStore.season())
                  );
                  return state;
                });
                coreStore.decreaseLoadingCount();
              })
            );
          })
        )
      ),
      addMatchday(matchday: string, opponent: string = 'unknown'): void {
        const substrIndex = matchday.lastIndexOf('_');
        const index = Number(matchday.substring(substrIndex + 1));

        patchState(store, state => {
          const days = state.matchdays ?? [];
          days.push({
            id: matchday,
            index: index,
            opponent: opponent,
          });
          state.matchdays = days;
          return state;
        });

        firebaseService.addMatchday(matchday, index, opponent);
      },
    })
  )
);
