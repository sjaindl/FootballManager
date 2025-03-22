import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { NewsStore } from '../admin/store/news.store';

export const newsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const newsStore = inject(NewsStore);

  return toObservable(newsStore.news).pipe(
    map(news => {
      if (news !== undefined) {
        return true;
      }
      newsStore.loadNews();
      return false;
    }),
    filter(canActivate => {
      return canActivate;
    })
  );
};
