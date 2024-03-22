import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { produce } from 'immer';
import { User } from '../../shared/user';

interface AuthState {
  user?: User;
}

const initialState: AuthState = {
  user: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ user }) => ({
    uid: computed(() => {
      if (user) {
        return user()?.uid ?? '';
      }
      return '';
    }),
    userName: computed(() => {
      if (user) {
        return user()?.userName ?? undefined;
      }
      return undefined;
    }),
  })),

  withMethods(store => ({
    setUser(user?: User): void {
      patchState(store, state => {
        return produce(state, draft => {
          draft.user = user;
        });
      });
    },
  }))
);
