import { CommonModule } from '@angular/common';
import { Component, Signal, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ChangePlayerRequestWrapper,
  Player,
} from '../../../shared/common.model';
import { Formation } from '../../../shared/formation';
import { FormationComponent } from '../../components/formation/formation.component';
import { LineupRowComponent } from '../../components/lineup-row/lineup-row.component';
import { ConfigStore } from '../../store/config.store';
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
  readonly playerStore = inject(PlayerStore);
  readonly lineupStore = inject(LineupStore);
  readonly configStore = inject(ConfigStore);

  selectedFormation: Signal<Formation | undefined>;
  formations: Signal<Formation[]>;
  freeze: Signal<boolean | undefined>;

  goalkeeper: Signal<Player>;
  defenders: Signal<Player[]>;
  midfielder: Signal<Player[]>;
  attacker: Signal<Player[]>;
  isFrozen: Signal<boolean>;

  constructor() {
    this.formations = this.formationStore.formations;
    this.selectedFormation = this.formationStore.selectedFormation;

    this.goalkeeper = this.lineupStore.goalkeeper;
    this.defenders = this.lineupStore.defenders;
    this.midfielder = this.lineupStore.midfielders;
    this.attacker = this.lineupStore.attackers;

    this.freeze = this.configStore.freeze;
    this.isFrozen = computed(() => this.freeze() === true);
  }

  onSelectedPlayerChanged($event: ChangePlayerRequestWrapper) {
    this.lineupStore.setPlayer($event);
  }

  onFormationChange($event: Formation) {
    this.formationStore.setSelectedFormation($event);
  }

  save() {
    this.lineupStore.saveLineup();
  }
}
