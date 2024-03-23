import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { FormationStore } from '../lineup/store/formation.store';

export const formationsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const formationStore = inject(FormationStore);

  return toObservable(formationStore.formations).pipe(
    map(formations => {
      if (formations.length > 0) {
        return true;
      }
      formationStore.loadFormations();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
