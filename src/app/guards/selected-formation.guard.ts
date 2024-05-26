import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStore } from '../auth/store/auth.store';
import { FormationStore } from '../lineup/store/formation.store';
import { isSignedInRequirement } from '../utils/is-signed-in-requirement';

export const selectedFormationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const formationStore = inject(FormationStore);

  const authStore = inject(AuthStore);

  const formation$ = toObservable(formationStore.formations);

  return isSignedInRequirement(
    toObservable(formationStore.selectedFormation),
    formation => {
      if (formation) {
        return true;
      }
      formationStore.loadSelectedFormation();
      return false;
    }
  );

  // return toObservable(formationStore.selectedFormation).pipe(
  //   map(formation => {
  //     if (formation) {
  //       return true;
  //     }
  //     formationStore.loadSelectedFormation();
  //     return false;
  //   }),
  //   filter(canActivate => {
  //     return canActivate;
  //   })
  // );
};
