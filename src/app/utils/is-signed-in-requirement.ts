import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';
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

export function guardDependency<T>(
  dependencies: Observable<boolean>[],
  obs: Observable<T>,
  mapFunction: (value: T, index: number) => boolean
) {
  return combineLatest(dependencies).pipe(
    tap(values => console.warn(values)),
    filter(isLoaded => isLoaded.every(value => value)),
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
