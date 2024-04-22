import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  Signal,
  computed,
  inject,
  input,
} from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlayerStore } from '../../lineup/store/player.store';
import { ChangePlayerRequest, Player } from '../common.model';
import { ImageComponent, S11Image } from '../image/image.component';

@Component({
  selector: 's11-player',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ImageComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent {
  player = input<Partial<Player>>();
  playerList = input<Player[]>([]);
  displayPointsSeparately = input(true);
  isSelectable = input(true);
  isAdmin = input(false);
  editMode = input<boolean>(false);
  matchDayId = input<string>();
  @Output() selectedPlayerChange = new EventEmitter<ChangePlayerRequest>();

  image: Signal<S11Image>;

  readonly playerStore = inject(PlayerStore);
  points: Signal<number>;

  constructor(private storage: Storage) {
    this.image = computed(() => ({
      ref: this.player()?.imageRef,
      url: undefined,
      alt: this.player()?.name,
    }));

    this.points = computed(() => {
      const matchDayId = this.matchDayId();

      const playerId = this.player()?.playerId;
      if (!playerId) {
        return 0;
      }

      if (matchDayId) {
        const matchdayPoints = this.playerStore.matchdayPoints();
        if (matchdayPoints.hasOwnProperty(playerId)) {
          const matchdaysWithPoints = matchdayPoints[playerId];

          const matchdayWithPoints = matchdaysWithPoints.find(day => {
            return day.matchday === matchDayId;
          });

          return matchdayWithPoints?.points ?? 0;
        }

        return 0;
      }

      return this.totalPoints(playerId);
    });
  }

  setCurrentPoints(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;
    const player = this.player();
    if (player) {
      player.pointsCurrentRound = Number(value);
    }
  }

  onValueChange(playerId: string) {
    this.selectedPlayerChange.emit({
      newPlayerId: playerId,
      oldPlayerId: this.player()?.playerId ?? '',
    });
  }

  totalPoints(playerId: string): number {
    const totalPoints = this.playerStore.totalPoints();

    if (totalPoints.hasOwnProperty(playerId)) {
      return totalPoints[playerId] ?? 0;
    }

    return 0;
  }
}
