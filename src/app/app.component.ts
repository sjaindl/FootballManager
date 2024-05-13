import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ConfigStore } from './lineup/store/config.store';
import { PlayerStore } from './lineup/store/player.store';
import { UserMatchdayStore } from './shared/store/user-matchday.store';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {
  readonly configStore = inject(ConfigStore);
  readonly playerStore = inject(PlayerStore);
  readonly userMatchdayStore = inject(UserMatchdayStore);
  title = 'S11';

  constructor() {
    this.configStore.loadConfig();
    this.playerStore.loadPlayers();
    this.userMatchdayStore.load();
  }
}
