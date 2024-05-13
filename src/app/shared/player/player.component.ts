import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlayerStore } from '../../lineup/store/player.store';
import { ChangePlayerRequest, Player } from '../common.model';
import { ImageComponent, S11Image } from '../image/image.component';
import { LineupData } from '../lineupdata';
import { UserLineupStore } from '../store/user-lineup.store';
import { UserMatchdayStore } from '../store/user-matchday.store';

@Component({
  selector: 's11-player',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ImageComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  player = input<Partial<Player>>();
  playerList = input<Player[]>([]);
  displayPointsSeparately = input(true);
  isSelectable = input(true);
  isAdmin = input(false);
  editMode = input<boolean>(false);
  matchDayId = input<string>();
  @Output() selectedPlayerChange = new EventEmitter<ChangePlayerRequest>();

  image: Signal<S11Image>;

  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly userLineupStore = inject(UserLineupStore);
  readonly playerStore = inject(PlayerStore);
  points: Signal<number>;
  numOfPastMatchdayLineups: Signal<number>;
  numOfCurrentMatchdayLineups: Signal<number>;

  constructor() {
    this.image = computed(() => ({
      ref: this.player()?.imageRef,
      url: undefined,
      alt: this.player()?.name,
    }));

    this.numOfCurrentMatchdayLineups = computed(() => {
      const playerId = this.player()?.playerId;
      if (!playerId) {
        return 0;
      }

      var lineupCount = 0;

      const lineups = this.userLineupStore.userToLineup();
      Object.values(lineups).forEach(lineupData => {
        lineupCount = this.calculateLineups(lineupCount, lineupData, playerId);
      });

      return lineupCount;
    });

    this.numOfPastMatchdayLineups = computed(() => {
      const playerId = this.player()?.playerId;
      if (!playerId) {
        return 0;
      }

      var lineupCount = 0;

      const userMatchdays = this.userMatchdayStore.usersToMatchdays();

      Object.values(userMatchdays).forEach(lineupDataArray => {
        lineupDataArray.forEach(lineupData => {
          lineupCount = this.calculateLineups(
            lineupCount,
            lineupData,
            playerId
          );
        });
      });

      return lineupCount;
    });

    this.points = computed(() => {
      const matchDayId = this.matchDayId();

      const playerId = this.player()?.playerId;
      if (!playerId) {
        return 0;
      }

      if (matchDayId) {
        const matchdayPoints = this.playerStore.matchdayPoints();
        if (matchdayPoints.hasOwnProperty(playerId)) {
          const matchdaysWithPoints = matchdayPoints[playerId];

          const matchdayWithPoints = matchdaysWithPoints.find(day => {
            return day.matchday === matchDayId;
          });

          return matchdayWithPoints?.points ?? 0;
        }

        return 0;
      }

      return this.totalPoints(playerId);
    });
  }

  private calculateLineups(
    lineupCount: number,
    lineupData: LineupData,
    playerId: string
  ) {
    lineupCount = this.calculateLineupCount(
      [lineupData.goalkeeper],
      lineupData,
      playerId,
      lineupCount
    );
    lineupCount = this.calculateLineupCount(
      lineupData.defenders,
      lineupData,
      playerId,
      lineupCount
    );
    lineupCount = this.calculateLineupCount(
      lineupData.midfielders,
      lineupData,
      playerId,
      lineupCount
    );
    lineupCount = this.calculateLineupCount(
      lineupData.attackers,
      lineupData,
      playerId,
      lineupCount
    );
    return lineupCount;
  }

  private calculateLineupCount(
    players: string[],
    lineupData: LineupData,
    playerId: string,
    lineupCount: number
  ) {
    const matchDayId = this.matchDayId();

    if (players.includes(playerId)) {
      if (matchDayId && matchDayId > '') {
        if (lineupData.id === matchDayId) {
          return lineupCount + 1;
        }
      } else {
        return lineupCount + 1;
      }
    }
    return lineupCount;
  }

  setCurrentPoints(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;
    const player = this.player();
    if (player) {
      player.pointsCurrentRound = Number(value);
    }
  }

  onValueChange(playerId: string) {
    this.selectedPlayerChange.emit({
      newPlayerId: playerId,
      oldPlayerId: this.player()?.playerId ?? '',
    });
  }

  totalPoints(playerId: string): number {
    const totalPoints = this.playerStore.totalPoints();

    if (totalPoints.hasOwnProperty(playerId)) {
      return totalPoints[playerId] ?? 0;
    }

    return 0;
  }
}
