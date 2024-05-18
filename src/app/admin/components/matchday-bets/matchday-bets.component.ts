import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  input,
  signal,
} from '@angular/core';
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
  imports: [MatTableModule, ImageComponent],
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

  users: Signal<User[]>;
  match: WritableSignal<string> = signal('');

  constructor() {
    this.users = this.userStore.users;
  }

  ngOnInit() {
    this.setCurrentBet();
    this.userBets = this.userBettingsStore.bets().filter(bets => {
      return bets.matchday === this.matchday();
    });
  }

  setCurrentBet() {
    const bets = this.bettingStore.bets();
    const bet = bets.find(bet => {
      return bet.matchday === this.matchday();
    });
    if (bet) {
      this.match.set(`${bet.home} : ${bet.away}`);
    }
  }
}
