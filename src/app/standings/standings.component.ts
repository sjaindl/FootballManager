import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchdayComponent } from '../admin/components/matchday/matchday.component';
import { MatchdayStore } from '../admin/store/matchday.store';
import { PlayerStore } from '../lineup/store/player.store';
import { Player } from '../shared/common.model';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { User } from '../shared/user';
import { UserStore } from './store/user.store';

interface UserWithPoints {
  user: User;
  points: number;
  pointsLastRound: number;
}

@Component({
  selector: 's11-standings',
  standalone: true,
  imports: [MatTabsModule, MatchdayComponent, MatTableModule, CommonModule],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.scss',
})
export class StandingsComponent implements OnInit {
  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly userStore = inject(UserStore);

  displayedColumns: string[] = ['image', 'name', 'points'];

  users: Signal<User[]>;
  matchdays: Signal<string[]>;
  players: Signal<Player[]>;

  userPoints: UserWithPoints[] = [];

  constructor() {
    this.users = this.userStore.users;
    this.matchdays = this.matchdayStore.matchdayKeys;
    this.players = this.playerStore.players;
  }

  ngOnInit(): void {
    this.calculatePoints();
  }

  calculatePoints() {
    const usersMatchdays = this.userMatchdayStore.usersToMatchdays();

    this.users().forEach(user => {
      var curPoints = 0;
      var pointsForRound = 0;
      const userMatchdays = usersMatchdays[user.uid];

      this.matchdays().forEach(matchday => {
        const lineupAtMatchday = userMatchdays.find(lineup => {
          return lineup.id === matchday;
        });

        if (lineupAtMatchday) {
          pointsForRound = 0;

          const points = this.pointsForPlayer(
            lineupAtMatchday.goalkeeper,
            matchday
          );
          curPoints += points;
          pointsForRound += points;

          lineupAtMatchday.defenders.forEach(playerId => {
            const points = this.pointsForPlayer(playerId, matchday);
            curPoints += points;
            pointsForRound += points;
          });

          lineupAtMatchday.midfielders.forEach(playerId => {
            const points = this.pointsForPlayer(playerId, matchday);
            curPoints += points;
            pointsForRound += points;
          });

          lineupAtMatchday.attackers.forEach(playerId => {
            const points = this.pointsForPlayer(playerId, matchday);
            curPoints += points;
            pointsForRound += points;
          });

          const penalty =
            (lineupAtMatchday.goalkeeper !== '' ? 0 : 1) +
            lineupAtMatchday.defenders.length +
            lineupAtMatchday.midfielders.length +
            lineupAtMatchday.attackers.length;

          curPoints -= penalty;
          pointsForRound -= penalty;

          console.log(matchday, points);
        }
      });

      this.userPoints.push({
        user: user,
        points: curPoints,
        pointsLastRound: pointsForRound,
      });
    });
  }

  pointsForPlayer(playerId: string, matchday: string): number {
    const player = this.players().find(player => {
      return player.playerId === playerId;
    });

    if (player) {
      const points = player.points[matchday];
      if (points === undefined || isNaN(points)) {
        return 0;
      }
      return points;
    }

    return 0;
  }
}
