import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, switchMap, take, tap } from 'rxjs';
import { CoreStore } from '../../core/store/core.store';
import { FirebaseService } from '../../service/firebase.service';
import { SnackbarService } from '../../service/snackbar.service';
import { Formation } from '../../shared/formation';
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
      snackBarService = inject(SnackbarService),
      coreStore = inject(CoreStore),
      lineupStore = inject(LineupStore)
    ) => {
      const findSelectedFormation = (
        formations: Formation[],
        selectedFormationId: string | undefined
      ) => {
        if (selectedFormationId && formations.length > 0) {
          return formations.find(
            formation =>
              formation.formation.trim() === selectedFormationId.trim()
          );
        }
        return undefined;
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
                    const selectedFormation = findSelectedFormation(
                      formations,
                      store.selectedFormationId()
                    );
                    patchState(store, { formations, selectedFormation });
                    if (selectedFormation) {
                      lineupStore.setFormation(selectedFormation);
                    }
                  },
                  error: () =>
                    snackBarService.open('Fehler beim Laden der Formation!'),
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
                    const formationId = user?.formation;
                    const selectedFormation = findSelectedFormation(
                      store.formations(),
                      formationId
                    );
                    patchState(store, {
                      selectedFormationId: formationId,
                      selectedFormation,
                    });
                    if (selectedFormation) {
                      lineupStore.setFormation(selectedFormation);
                    }
                  },
                  error: () =>
                    snackBarService.open(
                      'Fehler beim Laden der aktuellen Formation!'
                    ),
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

          patchState(store, {
            selectedFormation: formation,
            selectedFormationId: formation.formation,
          });
        },
      };
    }
  )
);
