import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthStore } from '../auth/store/auth.store';
import { ConfigStore } from '../lineup/store/config.store';
import { UserMatchdayStore } from '../shared/store/user-matchday.store';
import { BettingStore } from './store/bettings.store';

@Component({
  selector: 's11-betting-game',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './betting-game.component.html',
  styleUrl: './betting-game.component.scss',
})
export class BettingGameComponent implements OnInit {
  readonly userMatchDayStore = inject(UserMatchdayStore);
  readonly bettingStore = inject(BettingStore);
  readonly configStore = inject(ConfigStore);
  readonly authStore = inject(AuthStore);

  homeScore: WritableSignal<number> = signal(0);
  awayScore: WritableSignal<number> = signal(0);

  nextBet = this.bettingStore.nextBet();

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
        this.homeScore(),
        this.awayScore()
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

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
