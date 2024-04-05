import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PlayerStore } from '../../../lineup/store/player.store';

import { SnackbarService } from '../../../service/snackbar.service';
import { Player, PositionMapper } from '../../../shared/common.model';
import { MatchdayStore, PlayerWithMatchDay } from '../../store/matchday.store';

@Component({
  selector: 's11-matchday',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './matchday.component.html',
  styleUrl: './matchday.component.scss',
})
export class MatchdayComponent implements OnInit {
  matchday = input<string>();
  editMode = input<boolean>(false);

  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);

  players: Signal<Player[]>;
  matchdays: PlayerWithMatchDay[] = [];

  displayedColumns: string[] = ['position', 'name', 'points', 'id'];
  positionMapper: PositionMapper = new PositionMapper();

  constructor(private snackbarService: SnackbarService) {
    this.players = this.playerStore.players;
  }

  ngOnInit(): void {
    const map = this.matchdayStore.mapByMatchDay();
    console.log(map);
    console.log(this.matchday());

    const matchday = this.matchday();
    if (matchday) {
      const days = map.get(matchday) ?? [];
      this.matchdays = days;
    } else {
      const newMatchdays: PlayerWithMatchDay[] = this.playerStore
        .players()
        .map(player => {
          return {
            player: player,
            matchday: {
              id: this.getNextMatchday(),
              points: 0,
            },
          };
        });
      this.matchdays = newMatchdays;
    }
  }

  save() {
    if (!this.isValid()) {
      this.snackbarService.open(
        'Es wurden nicht für alle Spieler Punkte eingetragen!'
      );
      return;
    }

    this.matchdayStore.setPlayerMatchdays(this.matchdays);
    this.matchdayStore.setUserMatchdayLineups(this.getNextMatchday());
  }

  private isValid(): Boolean {
    var isValid = true;
    this.matchdays.forEach(matchDay => {
      const value = matchDay.matchday.pointsCurrentRound;
      console.log(value === undefined);
      console.log(isNaN(+Number(value)));
      if (value === undefined || isNaN(+Number(value))) {
        isValid = false;
      }
    });

    return isValid;
  }

  private getNextMatchday(): string {
    const matchDayKeys = this.matchdayStore.matchdayKeys();
    const lastMatchday = matchDayKeys[matchDayKeys.length - 1];
    const index = lastMatchday.lastIndexOf('_');
    const lastMatchdayNum = Number(lastMatchday.substring(index + 1));
    const newMatchday = lastMatchday.slice(0, -1) + (lastMatchdayNum + 1);

    return newMatchday;
  }
}
