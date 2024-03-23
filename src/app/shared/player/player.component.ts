import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  WritableSignal,
  input,
  signal,
} from '@angular/core';
import { Storage, getDownloadURL, ref } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnChanges, OnInit {
  player = input<Partial<Player>>();
  playerList = input<Player[]>([]);
  @Output() selectedPlayerChange = new EventEmitter<ChangePlayerRequest>();

  player$: WritableSignal<Partial<Player>> = signal({});
  playerList$: WritableSignal<Player[]> = signal([]);

  imageUrl: Promise<String> | undefined;

  constructor(private storage: Storage) {}

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

  ngOnChanges(changes: SimpleChanges): void {
    const player = this.player();
    if (changes['player'] && player) {
      this.player$.set(player);
    }
    if (changes['playerList'] || changes['player']) {
      this.playerList$.set(this.playerList());
    }
  }

  onValueChange(playerId: string) {
    this.selectedPlayerChange.emit({
      newPlayerId: playerId,
      oldPlayerId: this.player()?.playerId ?? '',
    });
  }
}
