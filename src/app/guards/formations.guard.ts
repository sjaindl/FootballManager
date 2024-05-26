import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { FormationStore } from '../lineup/store/formation.store';
import { isSignedInRequirement } from '../utils/is-signed-in-requirement';

export const formationsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const formationStore = inject(FormationStore);

  return isSignedInRequirement(
    toObservable(formationStore.formations),
    formations => {
      if (formations.length > 0) {
        return true;
      }
      formationStore.loadFormations();
      return false;
    }
  );
};
