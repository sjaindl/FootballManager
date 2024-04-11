import { CommonModule } from '@angular/common';
import { Component, Signal, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PlayerStore } from '../../../lineup/store/player.store';

import { LineupRowComponent } from '../../../lineup/components/lineup-row/lineup-row.component';
import { Player } from '../../../shared/common.model';
import { MatchdayStore } from '../../store/matchday.store';

@Component({
  selector: 's11-matchday',
  standalone: true,
  templateUrl: './matchday.component.html',
  styleUrl: './matchday.component.scss',
  imports: [CommonModule, FormsModule, MatButtonModule, LineupRowComponent],
})
export class MatchdayComponent {
  matchday = input<string>();
  editMode = input<boolean>(false);
  singleRow = input<boolean>(false);
  isAdmin = input<boolean>(true);

  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);

  players: Player[];

  goalkeeper: Signal<Player[]>;
  defenders: Signal<Player[]>;
  midfielder: Signal<Player[]>;
  attacker: Signal<Player[]>;

  constructor() {
    const totalPoints = this.playerStore.totalPoints();
    this.players = this.playerStore.players().sort((first, second) => {
      const firstPoints = totalPoints[first.playerId];
      const secondPoints = totalPoints[second.playerId];
      if (firstPoints > secondPoints) return -1;
      if (firstPoints < secondPoints) return 1;
      else return 0;
    });

    this.goalkeeper = this.playerStore.goalkeepers;
    this.defenders = this.playerStore.defenders;
    this.midfielder = this.playerStore.midfielders;
    this.attacker = this.playerStore.attackers;
  }
}
