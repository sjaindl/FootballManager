import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { FormationStore } from '../lineup/store/formation.store';

export const selectedFormationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const formationStore = inject(FormationStore);

  return toObservable(formationStore.selectedFormation).pipe(
    map(formation => {
      if (formation) {
        return true;
      }
      formationStore.loadSelectedFormation();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
