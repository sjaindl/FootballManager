import { Component, Signal, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchdayComponent } from '../admin/components/matchday-points/matchday-points.component';
import { MatchdayStore } from '../admin/store/matchday.store';
import { PlayerStore } from '../lineup/store/player.store';
import { Player } from '../shared/common.model';

@Component({
  selector: 's11-players',
  standalone: true,
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  imports: [MatchdayComponent, MatTabsModule],
})
export class PlayersComponent {
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);

  matchdays: Signal<string[] | undefined>;

  goalkeepers: Signal<Player[]>;
  defenders: Signal<Player[]>;
  midfielder: Signal<Player[]>;
  attacker: Signal<Player[]>;

  constructor() {
    this.matchdays = this.matchdayStore.matchdayKeys;

    this.goalkeepers = this.playerStore.goalkeepers;
    this.defenders = this.playerStore.defenders;
    this.midfielder = this.playerStore.midfielders;
    this.attacker = this.playerStore.attackers;
  }
}
