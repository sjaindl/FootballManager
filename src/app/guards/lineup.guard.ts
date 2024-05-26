import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { LineupStore } from '../lineup/store/lineup.store';
import { PlayerStore } from '../lineup/store/player.store';
import { isSignedInRequirement } from '../utils/is-signed-in-requirement';

export const lineupGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerStore = inject(PlayerStore);
  const lineupStore = inject(LineupStore);

  const value = computed(() => {
    return (
      playerStore.players() !== undefined &&
      lineupStore.formation() !== undefined &&
      lineupStore.hasPlayers()
    );
  });

  return isSignedInRequirement(toObservable(value), fulfillsRequirements => {
    if (fulfillsRequirements) {
      return true;
    }
    lineupStore.loadLineUp();
    return false;
  });
};
