import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { produce } from 'immer';

interface CoreState {
  loadingCount: number;
}

const initialState: CoreState = {
  loadingCount: 0,
};

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods(store => ({
    increaseLoadingCount(): void {
      patchState(store, state => {
        return produce(state, draft => {
          draft.loadingCount = draft.loadingCount + 1;
        });
      });
    },
    decreaseLoadingCount(): void {
      patchState(store, state => {
        // TODO
        // return produce(state, draft => {
        //   draft.loadingCount = draft.loadingCount - 1;
        // });

        state.loadingCount = state.loadingCount - 1;
        return state;
      });
    },
  }))
);
