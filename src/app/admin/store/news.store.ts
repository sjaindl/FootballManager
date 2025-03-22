import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { News } from '../../shared/news';

interface NewsState {
  news: News | undefined;
}

const initialState: NewsState = {
  news: undefined,
};

export const NewsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('newsStore'),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore)
    ) => ({
      loadNews: rxMethod<void>(
        pipe(
          distinctUntilChanged(),
          tap(() => coreStore.increaseLoadingCount()),
          switchMap(() => {
            return firebaseService.getNews().pipe(
              tap(news => {
                patchState(store, state => {
                  state.news = news;
                  return state;
                });
                coreStore.decreaseLoadingCount();
              })
            );
          })
        )
      ),
      setNews(news: News): void {
        patchState(store, state => {
          state.news = news;
          return state;
        });

        firebaseService.setNews(news);
      },
    })
  )
);
