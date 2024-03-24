import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
  input,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  ChangePlayerRequest,
  ChangePlayerRequestWrapper,
  Player,
  Position,
} from '../../../shared/common.model';
import { PlayerComponent } from '../../../shared/player/player.component';

@Component({
  selector: 's11-lineup-row',
  standalone: true,
  imports: [MatExpansionModule, PlayerComponent],
  templateUrl: './lineup-row.component.html',
  styleUrl: './lineup-row.component.scss',
})
export class LineupRowComponent implements OnChanges {
  rowTitle = input('');
  position = input<Position>();
  maxNumOfPlayers = input(0);
  selectedPlayers = input<Partial<Player>[]>([]);
  playerList = input<Player[]>([]);
  @Output() selectedPlayerChange =
    new EventEmitter<ChangePlayerRequestWrapper>();

  panelOpenState = true;
  numSelectedPlayers = 0;

  onPlayerChange(request: ChangePlayerRequest) {
    const position = this.position();
    if (position) {
      this.selectedPlayerChange.emit({ ...request, position: position });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPlayers']) {
      this.numSelectedPlayers = this.selectedPlayers().filter(player => {
        const playerId = player.playerId;
        if (!playerId) return false;
        return Number(playerId) > 0;
      }).length;
    }
  }
}
