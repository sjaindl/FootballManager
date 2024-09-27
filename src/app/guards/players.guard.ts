import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { PlayerStore } from '../lineup/store/player.store';

export const playersGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerStore = inject(PlayerStore);

  return toObservable(playerStore.players).pipe(
    map(players => {
      if (players !== undefined) {
        return true;
      }
      playerStore.loadPlayers();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
