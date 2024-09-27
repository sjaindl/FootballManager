import { Observable, combineLatest, filter, map, switchMap, tap } from 'rxjs';

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

export function guardDependencyTwoLevel<T>(
  dependencies: Observable<boolean>[],
  level2Dependencies: Observable<boolean>[],
  obs: Observable<T>,
  mapFunction: (value: T, index: number) => boolean
) {
  return combineLatest(dependencies).pipe(
    tap(values => console.warn(values)),
    filter(isLoaded => isLoaded.every(value => value)),
    // pipe(),
    switchMap(() =>
      combineLatest(level2Dependencies).pipe(
        tap(values => console.warn('level2', values)),
        filter(isLoaded => isLoaded.every(value => value)),
        switchMap(() =>
          obs.pipe(
            map(mapFunction),
            tap(values => console.warn('can act', values)),
            filter(canActivate => {
              return canActivate;
            })
          )
        )
      )
    )
  );
}
