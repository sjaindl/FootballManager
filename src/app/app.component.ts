import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BettingStore } from './betting-game/store/bettings.store';
import { FirebaseWrapperComponent } from './firebase-wrapper/firebase-wrapper.component';
import { HeaderComponent } from './header/header.component';
import { ConfigStore } from './lineup/store/config.store';
import { UserMatchdayStore } from './shared/store/user-matchday.store';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HeaderComponent, FirebaseWrapperComponent],
})
export class AppComponent {
  readonly configStore = inject(ConfigStore);
  readonly bettingsStore = inject(BettingStore);
  readonly userMatchdayStore = inject(UserMatchdayStore);

  constructor() {
    this.configStore.loadConfig();
    this.userMatchdayStore.load();
    this.bettingsStore.loadBets();
  }
}
