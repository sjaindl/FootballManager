import { Component, WritableSignal, inject, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BettingStore } from '../../../betting-game/store/bettings.store';
import { MatchdayBetsComponent } from '../../components/matchday-bets/matchday-bets.component';
import { MatchdayStore } from '../../store/matchday.store';

@Component({
  selector: 's11-user-bets',
  standalone: true,
  imports: [MatTabsModule, MatchdayBetsComponent],
  templateUrl: './user-bets.component.html',
  styleUrl: './user-bets.component.scss',
})
export class UserBetsComponent {
  readonly matchdayStore = inject(MatchdayStore);
  readonly bettingStore = inject(BettingStore);

  matchdays: WritableSignal<string[]> = signal([]);

  constructor() {
    const pastMatchdays = this.matchdayStore.matchdayKeys;
    const nextMatchday = this.bettingStore.nextBet()?.matchday;

    const allMatchdays = pastMatchdays();

    if (nextMatchday) {
      allMatchdays.push(nextMatchday);
    }

    // TODO: There are some duplicated elements at the end when calling matchdayKeys..
    const set = new Set(allMatchdays);
    const arr = Array.from(set);

    this.matchdays.set(arr);
  }
}
