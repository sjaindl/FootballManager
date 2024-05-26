import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { PointsStore } from '../standings/store/points.store';

export const pointsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const pointsStore = inject(PointsStore);

  return toObservable(pointsStore.userWithPoints).pipe(
    map(points => {
      if (points.length > 0) {
        return true;
      }
      pointsStore.calculatePoints();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
