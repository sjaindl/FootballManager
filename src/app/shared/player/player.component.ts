import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChangePlayerRequest, Player } from '../common.model';

@Component({
  selector: 's11-player',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnChanges {
  // TODO: Change to signal inputs when ready
  @Input() player: Partial<Player> = {};
  @Input() playerList: Player[] = [];
  @Output() selectedPlayerChange = new EventEmitter<ChangePlayerRequest>();

  player$: WritableSignal<Partial<Player>> = signal({});
  playerList$: WritableSignal<Player[]> = signal([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player']) {
      this.player$.set(this.player);
    }
    if (changes['playerList'] || changes['player']) {
      this.playerList$.set(
        this.playerList //.filter(p => p.playerId !== this.player.playerId)
      );
    }
  }

  onValueChange(playerId: string) {
    // const selectedPlayer = this.playerList.find(p => p.playerId === playerId);
    // if (selectedPlayer) {
    //   this.selectedPlayerChange.emit({selectedPlayer);
    // }
    this.selectedPlayerChange.emit({
      newPlayerId: playerId,
      oldPlayerId: this.player.playerId ?? '',
    });
  }
}
