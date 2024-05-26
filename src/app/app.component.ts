import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatchdayStore } from './admin/store/matchday.store';
import { AuthStore } from './auth/store/auth.store';
import { BettingStore } from './betting-game/store/bettings.store';
import { UserBettingsStore } from './betting-game/store/user-bettings.store';
import { FirebaseWrapperComponent } from './firebase-wrapper/firebase-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { ConfigStore } from './lineup/store/config.store';
import { PlayerStore } from './lineup/store/player.store';
import { AuthService } from './service/auth.service';
import { UserMatchdayStore } from './shared/store/user-matchday.store';
import { PointsStore } from './standings/store/points.store';
import { UserStore } from './standings/store/user.store';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HeaderComponent, FirebaseWrapperComponent],
})
export class AppComponent {
  readonly bettingsStore = inject(BettingStore);
  readonly configStore = inject(ConfigStore);
  readonly playerStore = inject(PlayerStore);
  readonly userStore = inject(UserStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly pointsStore = inject(PointsStore);
  readonly userBettingStore = inject(UserBettingsStore);
  readonly authStore = inject(AuthStore);

  constructor(authService: AuthService) {
    // this.configStore.loadConfig();

    // TODO: Introduce master guards, when multiple guards are necessary (e.g. standings) instead of preloading everything
    // https://blog.sandbay.it/news/javascript/angular/multiple-nested-guards-on-one-route/
    // this.userStore.loadUsers();
    // this.playerStore.loadPlayers();
    // this.matchdayStore.loadMatchdays();
    this.userMatchdayStore.load();
    this.bettingsStore.loadBets();

    (async () => {
      await this.delay(1000);
      this.userBettingStore.calculateBets();
      await this.delay(1000);
      this.pointsStore.calculatePoints();
    })();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
