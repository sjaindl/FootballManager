import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Signal,
  computed,
  input,
} from '@angular/core';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChangePlayerRequest, Player } from '../common.model';

@Component({
  selector: 's11-player',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  player = input<Partial<Player>>();
  playerList = input<Player[]>([]);
  displayPointsSeparately = input(true);
  isSelectable = input(true);
  isAdmin = input(false);
  editMode = input<boolean>(false);
  matchDayId = input<string>();
  @Output() selectedPlayerChange = new EventEmitter<ChangePlayerRequest>();

  imageUrl: Promise<String> | undefined;

  points: Signal<number>;
  pointsCurrentRound: Signal<number>;

  constructor(private storage: Storage) {
    this.points = computed(() => {
      const matchDayId = this.matchDayId();
      const points = this.player()?.points;
      if (!points) {
        return 0;
      }

      if (matchDayId) {
        if (points.hasOwnProperty(matchDayId)) {
          return points[matchDayId] ?? 0;
        }
        return 0;
      }

      return this.totalPoints(points);
    });

    this.pointsCurrentRound = computed(() => 0);
  }

  ngOnInit(): void {
    const playerRef = this.player()?.imageRef;

    if (playerRef) {
      const storageRef = ref(this.storage, playerRef);
      this.imageUrl = getDownloadURL(storageRef);
    } else {
      const storageRef = ref(this.storage, 'players/no_photo.jpg');
      this.imageUrl = getDownloadURL(storageRef);
    }
  }

  onValueChange(playerId: string) {
    this.selectedPlayerChange.emit({
      newPlayerId: playerId,
      oldPlayerId: this.player()?.playerId ?? '',
    });
  }

  totalPoints(pointsOptional: Record<string, number> | undefined): number {
    const points = pointsOptional;
    if (!points) {
      return 0;
    }

    var totalPoints = 0;

    Object.entries(points).forEach(([matchDayKey, pointsOfMatchDay]) => {
      totalPoints += pointsOfMatchDay;
    });

    return totalPoints;
  }
}
