import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { LineupStore } from '../lineup/store/lineup.store';
import { PlayerStore } from '../lineup/store/player.store';

export const lineupGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const playerStore = inject(PlayerStore);
  const lineupStore = inject(LineupStore);

  const value = computed(() => {
    return (
      playerStore.players().length > 0 &&
      lineupStore.formation() !== undefined &&
      lineupStore.hasPlayers()
    );
  });

  return toObservable(value).pipe(
    map(fulfillsRequirements => {
      if (fulfillsRequirements) {
        return true;
      }
      lineupStore.loadLineUp();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );

  // return combineLatest([

  //   toObservable(playerStore.players),
  //   toObservable(lineupStore.formation),
  // ]).pipe(
  //   map(
  //     ([players, formation]) => players.length > 0 && formation !== undefined
  //   ),
  //   filter(fulfillsRequirements => {
  //     return fulfillsRequirements;
  //   }),
  //   //distinctUntilChanged(),
  //   switchMap(() =>
  //     toObservable(lineupStore.hasPlayers).pipe(
  //       map(hasPlayers => {
  //         if (hasPlayers) {
  //           return true;
  //         }

  //         lineupStore.loadLineUp();
  //         return false;
  //       }),
  //       filter(canActivate => {
  //         return canActivate;
  //       })
  //     )
  //   )
  // );
};
