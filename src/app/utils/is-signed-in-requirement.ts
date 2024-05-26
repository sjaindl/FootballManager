import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, filter, map, switchMap } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';

export function isSignedInRequirement<T>(
  obs: Observable<T>,
  mapFunction: (value: T, index: number) => boolean
) {
  const authStore = inject(AuthStore);

  return toObservable(authStore.isSignedIn).pipe(
    filter(isSignedIn => isSignedIn),
    switchMap(() =>
      obs.pipe(
        map(mapFunction),
        filter(canActivate => {
          return canActivate;
        })
      )
    )
  );
}
