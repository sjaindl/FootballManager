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
import { noBetText } from '../../../shared/constants';
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

  displayedColumns: string[] = ['image', 'name', 'bet'];

  userBets: UserWithBets[] = [];

  users: Signal<User[]>;
  match: WritableSignal<string> = signal('');

  constructor() {
    this.users = this.userStore.users;
  }

  ngOnInit() {
    this.setCurrentBet();
    this.calculateBets();
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

  calculateBets() {
    const usersMatchdays = this.userMatchdayStore.usersToMatchdays();

    this.users().forEach(user => {
      const userMatchdays = usersMatchdays[user.uid];

      const userDataAtMatchday = userMatchdays.find(userData => {
        return userData.id === this.matchday();
      });

      if (userDataAtMatchday) {
        const homeScore = userDataAtMatchday.homeScore;
        const awayScore = userDataAtMatchday.awayScore;
        var bet = noBetText;
        if (homeScore != undefined && awayScore != undefined) {
          bet = `${homeScore} : ${awayScore}`;
        }

        this.userBets.push({
          image: {
            ref: user.photoRef,
            url: user.photoUrl,
            alt: user.userName,
          },
          user: user,
          bet: bet,
        });
      } else {
        this.userBets.push({
          image: {
            ref: user.photoRef,
            url: user.photoUrl,
            alt: user.userName,
          },
          user: user,
          bet: noBetText,
        });
      }
    });
  }
}
