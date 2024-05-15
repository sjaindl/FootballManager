import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchdayComponent } from '../admin/components/matchday-points/matchday-points.component';
import { MatchdayStore } from '../admin/store/matchday.store';
import { PlayerStore } from '../lineup/store/player.store';
import { Player } from '../shared/common.model';
import { requiredNumOfPlayers } from '../shared/constants';
import { ImageComponent, S11Image } from '../shared/image/image.component';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { User } from '../shared/user';
import { UserStore } from './store/user.store';

interface UserWithPoints {
  image: S11Image;
  user: User;
  points: number;
  pointsLastRound: number;
}

@Component({
  selector: 's11-standings',
  standalone: true,
  imports: [
    MatTabsModule,
    MatchdayComponent,
    MatTableModule,
    CommonModule,
    ImageComponent,
  ],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.scss',
})
export class StandingsComponent implements OnInit {
  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly userStore = inject(UserStore);

  displayedColumns: string[] = ['place', 'image', 'name', 'points'];

  users: Signal<User[]>;
  matchdays: Signal<string[]>;
  players: Signal<Player[]>;

  userPoints: UserWithPoints[] = [];

  constructor() {
    this.users = this.userStore.users;
    this.matchdays = this.matchdayStore.matchdayKeys;
    this.players = this.playerStore.players;
  }

  ngOnInit() {
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

          const playersInFormation =
            (lineupAtMatchday.goalkeeper !== '' ? 1 : 0) +
            lineupAtMatchday.defenders.length +
            lineupAtMatchday.midfielders.length +
            lineupAtMatchday.attackers.length;

          const penaltyForMissingPlayers =
            requiredNumOfPlayers - playersInFormation;

          curPoints -= penaltyForMissingPlayers;
          pointsForRound -= penaltyForMissingPlayers;

          console.log(matchday, points);
        } else {
          pointsForRound = -requiredNumOfPlayers;
          curPoints -= requiredNumOfPlayers;
        }
      });

      this.userPoints.push({
        image: { ref: user.photoRef, url: user.photoUrl, alt: user.userName },
        user: user,
        points: curPoints,
        pointsLastRound: pointsForRound,
      });
    });

    this.userPoints.sort((first, second) => {
      const firstPoints = first.points;
      const secondPoints = second.points;
      if (firstPoints > secondPoints) return -1;
      if (firstPoints < secondPoints) return 1;
      else return 0;
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
