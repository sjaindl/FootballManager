import { Component, Signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ConfigStore } from '../../lineup/store/config.store';
import { PlayerStore } from '../../lineup/store/player.store';
import { MatchdayComponent } from '../components/matchday/matchday.component';
import { MatchdayStore } from '../store/matchday.store';

@Component({
  selector: 's11-admin',
  standalone: true,
  imports: [MatTabsModule, MatchdayComponent, MatButtonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  readonly playerStore = inject(PlayerStore);
  readonly matchdayStore = inject(MatchdayStore);
  readonly configStore = inject(ConfigStore);

  matchdays: Signal<string[]>;
  freeze: Signal<boolean | undefined>;

  constructor() {
    this.matchdays = this.matchdayStore.matchdayKeys;
    this.freeze = this.configStore.freeze;
  }

  buttonTitle(): string {
    return this.isFrozen() ? 'Unfreeze' : 'Freeze';
  }

  isFrozen(): boolean {
    return this.freeze() === true;
  }

  toggleFreeze() {
    this.configStore.setConfig(!this.isFrozen());
  }
}
