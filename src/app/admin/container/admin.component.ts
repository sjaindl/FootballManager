import { Component, Signal, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfigStore } from '../../lineup/store/config.store';
import { PlayerStore } from '../../lineup/store/player.store';
import { MatchdayComponent } from '../components/matchday/matchday.component';
import { MatchdayStore } from '../store/matchday.store';

@Component({
  selector: 's11-admin',
  standalone: true,
  imports: [MatTabsModule, MatchdayComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly configStore = inject(ConfigStore);

  matchdays: Signal<string[]>;

  constructor() {
    this.matchdays = this.matchdayStore.matchdayKeys;
  }
}
