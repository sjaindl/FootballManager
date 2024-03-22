import { CommonModule } from '@angular/common';
import { Component, Signal, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getState } from '@ngrx/signals';
import { CoreStore } from '../../../core/store/core.store';
import {
  ChangePlayerRequestWrapper,
  Player,
} from '../../../shared/common.model';
import { Formation } from '../../../shared/formation';
import { FormationComponent } from '../../components/formation/formation.component';
import { LineupRowComponent } from '../../components/lineup-row/lineup-row.component';
import { FormationStore } from '../../store/formation.store';
import { LineupStore } from '../../store/lineup.store';
import { PlayerStore } from '../../store/player.store';

@Component({
  selector: 's11-lineup',
  standalone: true,
  imports: [
    FormationComponent,
    LineupRowComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
})
export class LineupComponent {
  readonly formationStore = inject(FormationStore);
  readonly coreStore = inject(CoreStore);
  readonly playerStore = inject(PlayerStore);
  readonly lineupStore = inject(LineupStore);
  readonly snackBar = inject(MatSnackBar);

  selectedFormation: Signal<Formation | undefined>;
  formations: Signal<Formation[]>;
  player: Signal<Player[]>;

  goalkeeper: Signal<Player>;
  defenders: Signal<Player[]>;
  midfielder: Signal<Player[]>;
  attacker: Signal<Player[]>;

  constructor() {
    this.formations = this.formationStore.formations;
    this.selectedFormation = this.formationStore.selectedFormation;
    this.player = this.playerStore.players;

    this.goalkeeper = this.lineupStore.goalkeeper;
    this.defenders = this.lineupStore.defenders;
    this.midfielder = this.lineupStore.midfielders;
    this.attacker = this.lineupStore.attackers;
  }

  onSelectedPlayerChanged($event: ChangePlayerRequestWrapper) {
    this.lineupStore.setPlayer($event);
  }

  onFormationChange($event: Formation) {
    this.formationStore.setSelectedFormation($event);
  }

  save() {
    if (
      this.containsDuplicates(this.lineupStore.defenders()) ||
      this.containsDuplicates(this.lineupStore.midfielders()) ||
      this.containsDuplicates(this.lineupStore.attackers())
    ) {
      console.error('Spieler dürfen nur einmal aufgestellt werden!');
      this.snackBar.open('Spieler dürfen nur einmal aufgestellt werden!');
    } else {
      this.lineupStore.saveLineup();
    }
  }

  private containsDuplicates(players: Player[]) {
    let entries = new Set();
    players.forEach(player => {
      entries.add(player.playerId);
    });

    return entries.size != players.length;
  }
}

// TODO:
//   1. Signal-Store für den Lineup
//   2. Event emitter
//   3. Changes in Store schreiben / Werte rauslesen
//   4. Firebase mit Store verknüpfen
//   5. Firebase Storage für Icons
//   6. Check keine doppelte Spielerauswahl (ausgewählte Spieler filtern & in player.component zum Array hinzufügen)

// Ideen: Admin - Abstimmung für Punkte, Historie/Statistiken per Spiel (Gegner, Ergebnis, Punkte pro Spieler..)
// Sum query für aggregate Punkte: https://firebase.google.com/docs/firestore/query-data/aggregation-queries#web-modular-api_3
// Firebase Store vorbereiten
