import { Component, OnInit, Signal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../auth/store/auth.store';
import { ConfigStore } from '../lineup/store/config.store';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { OnlyNumber } from '../utils/only-number.directive';
import { BettingStore } from './store/bettings.store';

@Component({
  selector: 's11-betting-game',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    OnlyNumber,
    MatIcon,
  ],
  templateUrl: './betting-game.component.html',
  styleUrl: './betting-game.component.scss',
})
export class BettingGameComponent implements OnInit {
  readonly userMatchDayStore = inject(UserMatchdayStore);
  readonly bettingStore = inject(BettingStore);
  readonly configStore = inject(ConfigStore);
  readonly authStore = inject(AuthStore);

  homeScore = signal<number | undefined>(undefined);
  awayScore = signal<number | undefined>(undefined);

  nextBet = this.bettingStore.nextBet();
  freeze: Signal<boolean | undefined>;

  constructor() {
    this.freeze = this.configStore.freeze;
  }

  ngOnInit() {
    this.initBets();
  }

  initBets() {
    const days = this.userMatchDayStore.usersToMatchdays();
    const curUserUid = this.authStore.user()?.uid;

    if (curUserUid) {
      const userDataList = days[curUserUid];

      const nextBet = this.bettingStore.nextBet();
      const userData = userDataList.find(data => {
        return data.id === nextBet?.matchday;
      });

      if (userData) {
        const homeScore = userData.homeScore;
        const awayScore = userData.awayScore;
        if (homeScore != undefined && awayScore != undefined) {
          this.homeScore.set(homeScore);
          this.awayScore.set(awayScore);
        }
      }
    }
  }

  submitBet() {
    const nextMatchDay = this.nextBet?.matchday;
    const curUserUid = this.authStore.user()?.uid;

    if (nextMatchDay != undefined && curUserUid != undefined) {
      this.userMatchDayStore.setUserMatchdayBet(
        nextMatchDay,
        curUserUid,
        this.homeScore() ?? 0,
        this.awayScore() ?? 0
      );
    }
  }

  setHomeScore(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.homeScore.set(Number(element.value));
  }

  setAwayScore(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.awayScore.set(Number(element.value));
  }

  isFrozen(): boolean {
    return this.freeze() === true;
  }
}
