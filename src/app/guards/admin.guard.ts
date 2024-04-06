import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { MatchdayStore } from '../admin/store/matchday.store';
import { AuthStore } from '../auth/store/auth.store';
import { PlayerStore } from '../lineup/store/player.store';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerStore = inject(PlayerStore);
  const matchdayStore = inject(MatchdayStore);
  const authStore = inject(AuthStore);

  const value = computed(() => {
    return (
      matchdayStore.matchdays().length > 0 &&
      playerStore.players().length > 0 &&
      authStore.user()?.isAdmin
    );
  });

  return toObservable(value).pipe(
    map(fulfillsRequirements => {
      if (fulfillsRequirements) {
        return true;
      }

      if (playerStore.players().length === 0) {
        playerStore.loadPlayers();
      }

      if (matchdayStore.matchdays().length === 0) {
        matchdayStore.loadMatchdays();
      }
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
