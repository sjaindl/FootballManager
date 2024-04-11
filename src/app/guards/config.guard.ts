import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { ConfigStore } from '../lineup/store/config.store';

export const configGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const configStore = inject(ConfigStore);

  return toObservable(configStore.freeze).pipe(
    map(freeze => {
      if (freeze !== undefined) {
        return true;
      }
      configStore.loadConfig();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
