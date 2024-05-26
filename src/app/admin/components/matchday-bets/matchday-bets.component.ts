import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { BettingStore } from '../../../betting-game/store/bettings.store';
import { UserBettingsStore } from '../../../betting-game/store/user-bettings.store';
import {
  ImageComponent,
  S11Image,
} from '../../../shared/image/image.component';
import { UserMatchdayStore } from '../../../shared/store/user-matchday.store';
import { User } from '../../../shared/user';
import { UserStore } from '../../../standings/store/user.store';

interface UserWithBets {
  image: S11Image;
  user: User;
  bet: string;
}

@Component({
  selector: 's11-matchday-bets',
  standalone: true,
  imports: [MatTableModule, ImageComponent, MatButtonModule],
  templateUrl: './matchday-bets.component.html',
  styleUrl: './matchday-bets.component.scss',
})
export class MatchdayBetsComponent implements OnInit {
  matchday = input<string>();

  readonly userMatchdayStore = inject(UserMatchdayStore);
  readonly userStore = inject(UserStore);
  readonly bettingStore = inject(BettingStore);
  readonly userBettingsStore = inject(UserBettingsStore);

  displayedColumns: string[] = ['image', 'name', 'bet'];

  userBets: UserWithBets[] = [];

  match: WritableSignal<string> = signal('');
  homeScore: WritableSignal<number> = signal(0);
  awayScore: WritableSignal<number> = signal(0);

  ngOnInit() {
    this.setCurrentBet();
    const bets = this.userBettingsStore.bets() ?? [];
    this.userBets = bets.filter(bets => {
      return bets.matchday === this.matchday();
    });
  }

  setCurrentBet() {
    const bet = this.bettingStore.bets()?.find(bet => {
      return bet.matchday === this.matchday();
    });
    if (bet) {
      if (bet.resultScoreHome) {
        this.homeScore.set(bet.resultScoreHome);
      }
      if (bet.resultScoreAway) {
        this.awayScore.set(bet.resultScoreAway);
      }
      this.match.set(`${bet.home} : ${bet.away}`);
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

  saveResult() {
    const day = this.matchday();
    if (day) {
      this.bettingStore.saveBet(day, this.homeScore(), this.awayScore());
    }
  }
}
