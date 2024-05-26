import { CommonModule } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatchdayComponent } from '../admin/components/matchday-points/matchday-points.component';
import { MatchdayStore } from '../admin/store/matchday.store';
import { PlayerStore } from '../lineup/store/player.store';
import { Player } from '../shared/common.model';
import { ImageComponent } from '../shared/image/image.component';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { User } from '../shared/user';
import { PointsStore, UserWithPoints, sortPoints } from './store/points.store';
import { UserStore } from './store/user.store';

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
export class StandingsComponent {
  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly userStore = inject(UserStore);
  readonly pointsStore = inject(PointsStore);

  displayedColumns: string[] = ['place', 'image', 'name', 'points'];

  users: Signal<User[]>;
  matchdays: Signal<string[]>;
  players: Signal<Player[]>;

  userPoints: Signal<UserWithPoints[] | undefined>;

  sorting = sortPoints;

  constructor() {
    this.users = this.userStore.users;
    this.matchdays = this.matchdayStore.matchdayKeys;
    this.players = this.playerStore.players;
    this.userPoints = this.pointsStore.userWithPoints;
  }
}
