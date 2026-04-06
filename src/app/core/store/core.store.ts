import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

interface CoreState {
  loadingCount: number;
}

const initialState: CoreState = {
  loadingCount: 0,
};

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('coreStore'),

  withMethods(store => ({
    increaseLoadingCount(): void {
      patchState(store, state => ({
        loadingCount: state.loadingCount + 1,
      }));
    },
    decreaseLoadingCount(): void {
      patchState(store, state => ({
        loadingCount: state.loadingCount - 1,
      }));
    },
  }))
);
