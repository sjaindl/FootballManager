import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../models/user.model';

type ProfileState = {
  user?: User;
};

const initialState: ProfileState = {
  user: {
    displayName: 'Peter Fonsberger',
    iconUrl: 'https://i.ds.at/hoS2Wg/rs:fill:750:0/plain/20070713/hom_gr.jpg',
    mail: 'petfonsi@gmx.de',
    name: 'Peter Fonsberger',
    uid: 'irgendeine UUID -> Die FIXME benötigt',
  },
};

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    userName: computed(() => {
      if (user) {
        return user()?.name ?? '';
      }
      return '';
    }),
  })),

  withMethods(store => ({
    updateName(name: string): void {
      patchState(store, state => {
        if (state.user) {
          return { user: { ...state.user, name: name } };
        }
        return { ...state };
      });
    },
  }))
);
