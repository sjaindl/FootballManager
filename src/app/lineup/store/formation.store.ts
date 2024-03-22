import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, take, tap } from 'rxjs';
import { FirebaseService } from '../../service/firebase.service';
import { Formation } from '../../shared/formation';

import { MatSnackBar } from '@angular/material/snack-bar';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { CoreStore } from '../../core/store/core.store';
import { LineupStore } from './lineup.store';

interface FormationState {
  selectedFormationId: string | undefined;
  formations: Formation[];
  selectedFormation: Formation | undefined;
}

const initialState: FormationState = {
  selectedFormationId: undefined,
  formations: [],
  selectedFormation: undefined,
};

export const FormationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withDevtools('formationStore'),

  withMethods(
    (
      store,
      firebaseService = inject(FirebaseService),
      coreStore = inject(CoreStore),
      lineupStore = inject(LineupStore),
      snackBar = inject(MatSnackBar)
    ) => {
      const setSelectedFormationById = (state: FormationState) => {
        const id = state.selectedFormationId;
        if (id && state.formations.length > 0) {
          const newFormation = state.formations.find(formation => {
            return formation.formation.trim() === id.trim();
          });

          state.selectedFormation = newFormation;
          lineupStore.setFormation(state.selectedFormation);
        }
      };

      return {
        loadFormations: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => coreStore.increaseLoadingCount()),
            switchMap(() => {
              return firebaseService.getFormations().pipe(
                // take(1),
                tapResponse({
                  next: formations => {
                    patchState(store, state => {
                      state.formations = formations;
                      setSelectedFormationById(state);
                      return state;
                    });
                  },
                  error: () =>
                    snackBar.open('Fehler beim Laden der Formation!'), //TODO: Move to SnackbarService
                  finalize: () => {
                    coreStore.decreaseLoadingCount();
                  },
                }),
                take(1)
              );
            })
          )
        ),

        loadSelectedFormation: rxMethod<void>(
          pipe(
            distinctUntilChanged(),
            tap(() => coreStore.increaseLoadingCount()),
            switchMap(() => {
              return firebaseService.getCurrentUser().pipe(
                take(1),
                tapResponse({
                  next: user => {
                    patchState(store, state => {
                      const formationId = user?.formation;

                      state.selectedFormationId = formationId;

                      setSelectedFormationById(state);

                      return state;
                    });
                  },
                  error: () =>
                    snackBar.open('Fehler beim Laden der aktuellen Formation!'), //TODO: Move to SnackbarService
                  finalize: () => {
                    coreStore.decreaseLoadingCount();
                  },
                })
              );
            })
          )
        ),

        setSelectedFormation(formation: Formation): void {
          lineupStore.setFormation(formation);
          lineupStore.saveLineup();
          firebaseService.setFormation(formation.formation);

          patchState(store, state => {
            state.selectedFormation = formation;
            state.selectedFormationId = formation.formation;
            return state;
          });
        },
      };
    }
  )
);
