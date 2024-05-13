import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import {
  MatchdayWithPoints,
  PlayerStore,
  sortMatchdayWithPointsByMatchday,
} from '../../../lineup/store/player.store';
import {
  numOfDisplayedMvps,
  numOfDisplayedMvpsLastRound,
} from '../../../shared/constants';
import { Mvp, sortMvpByPoints } from '../../../shared/mvp';
import { StatsItemComponent } from '../../components/stats-items/stats-item.component';

@Component({
  selector: 's11-stats',
  standalone: true,
  imports: [StatsItemComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  readonly playerStore = inject(PlayerStore);

  mvpPlayersByPoints: WritableSignal<Mvp[]> = signal([]);
  topPlayersLastRound: WritableSignal<Mvp[]> = signal([]);

  topPlayersTitle =
    'Top ' + numOfDisplayedMvpsLastRound + ' der Runde (Punkte)';

  ngOnInit(): void {
    this.mvpPlayersByPoints.set(
      this.mapTotalPoints(this.playerStore.totalPoints())
    );

    this.topPlayersLastRound.set(
      this.mapTopPlayersLastRound(this.playerStore.matchdayPoints())
    );
  }

  mapTotalPoints(totalPoints: Record<string, number>) {
    return Object.entries(totalPoints)
      .map(([playerId, points]) => {
        return {
          playerName: this.playerName(playerId),
          points: points,
        };
      })
      .sort(sortMvpByPoints)
      .slice(0, numOfDisplayedMvps);
  }

  mapTopPlayersLastRound(matchdayPoints: Record<string, MatchdayWithPoints[]>) {
    return Object.entries(matchdayPoints)
      .map(([playerId, matchDayPoints]) => {
        const sortedMatchdayPoints = matchDayPoints.sort(
          sortMatchdayWithPointsByMatchday
        );

        const points =
          sortedMatchdayPoints.length === 0
            ? 0
            : sortedMatchdayPoints[sortedMatchdayPoints.length - 1].points;

        return {
          playerName: this.playerName(playerId),
          points: points,
        };
      })
      .sort(sortMvpByPoints)
      .slice(0, numOfDisplayedMvpsLastRound);
  }

  playerName(playerId: string): string {
    const playerName = this.playerStore.players().find(player => {
      return player.playerId === playerId;
    })?.name;

    return playerName ?? playerId;
  }
}
