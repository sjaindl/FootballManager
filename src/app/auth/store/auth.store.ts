import { withDevtools } from '@angular-architects/ngrx-toolkit';
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
  user: User | undefined;
}

const initialState: AuthState = {
  user: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('authStore'),

  withComputed(({ user }) => ({
    isSignedIn: computed(() => {
      return user() ? true : false;
    }),
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
    imageUrl: computed(() => {
      if (user) {
        return user()?.photoUrl ?? undefined;
      }
      return undefined;
    }),
    imageRef: computed(() => {
      if (user) {
        return user()?.photoRef ?? undefined;
      }
      return undefined;
    }),
  })),

  withMethods(store => {
    return {
      setUser(user?: User): void {
        patchState(store, state => {
          return produce(state, draft => {
            draft.user = user;
          });
        });
      },
      updateName(name: string): void {
        patchState(store, state => {
          if (state.user) {
            // TODO: ... Mit immer ersetzen
            return { user: { ...state.user, name: name } };
          }
          return { ...state };
        });
      },
      updatePhotoRef(photoRef: string): void {
        patchState(store, state => {
          if (state.user) {
            // TODO: ... Mit immer ersetzen
            return { user: { ...state.user, photoRef: photoRef } };
          }
          return { ...state };
        });
      },
    };
  })
);
