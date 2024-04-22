import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatchdayStore } from '../admin/store/matchday.store';
import { AppComponent } from '../app.component';
import { ConfigStore } from '../lineup/store/config.store';
import { LineupStore } from '../lineup/store/lineup.store';
import { PlayerStore } from '../lineup/store/player.store';
import { FirebaseService } from '../service/firebase.service';
import { SnackbarService } from '../service/snackbar.service';
import { ProfileMenuIconComponent } from '../user/components/profile-menu-icon/profile-menu-icon.component';
import { UserIconComponent } from '../user/components/user-icon/user-icon.component';

@Component({
  selector: 's11-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIcon,
    MatMenuTrigger,
    UserIconComponent,
    ProfileMenuIconComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly lineupStore = inject(LineupStore);
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly configStore = inject(ConfigStore);

  title = new AppComponent().title;

  constructor(
    public router: Router,
    private snackbarService: SnackbarService,
    private firebaseService: FirebaseService
  ) {}

  saveLineup() {
    this.lineupStore.saveLineup();
  }

  saveMatchday() {
    if (!this.isValid()) {
      this.snackbarService.open(
        'Es wurden nicht für alle Spieler Punkte eingetragen!'
      );
      return;
    }

    const nextDay = this.matchdayStore.nextMatchday();

    this.matchdayStore.addMatchday(nextDay);
    this.playerStore.setPlayerMatchdays(this.playerStore.players(), nextDay);

    // TODO: move to user matchday store
    this.firebaseService.setUserMatchdayLineup(nextDay);

    this.playerStore.resetCurrentPoints();
  }

  private isValid(): Boolean {
    var isValid = true;
    this.playerStore.players().forEach(player => {
      const value = player.pointsCurrentRound;
      console.log(value === undefined);
      console.log(isNaN(+Number(value)));
      if (value === undefined || isNaN(+Number(value))) {
        isValid = false;
      }
    });

    return isValid;
  }
}
