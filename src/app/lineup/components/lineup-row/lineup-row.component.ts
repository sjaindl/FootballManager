import {
  Component,
  EventEmitter,
  Output,
  Signal,
  computed,
  input,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  ChangePlayerRequest,
  ChangePlayerRequestWrapper,
  Player,
  Position,
} from '../../../shared/common.model';
import { isUndefinedPlayer } from '../../../shared/common.utils';
import { PlayerComponent } from '../../../shared/player/player.component';

@Component({
  selector: 's11-lineup-row',
  standalone: true,
  imports: [MatExpansionModule, PlayerComponent],
  templateUrl: './lineup-row.component.html',
  styleUrl: './lineup-row.component.scss',
})
export class LineupRowComponent {
  rowTitle = input('');
  position = input<Position>();
  maxNumOfPlayers = input(0);
  selectedPlayers = input<Partial<Player>[]>([]);
  playerList = input<Player[]>([]);
  isForLineup = input(true);
  isAdmin = input(false);
  isFrozen = input(true);
  editMode = input<boolean>(false);
  matchDayId = input<string>();
  @Output() selectedPlayerChange =
    new EventEmitter<ChangePlayerRequestWrapper>();

  panelOpenState = true;
  numSelectedPlayers: Signal<number>;

  constructor() {
    this.numSelectedPlayers = computed(() => {
      return this.selectedPlayers().filter(player => {
        const playerId = player.playerId;
        if (!playerId) return false;
        return !isUndefinedPlayer(player);
      }).length;
    });
  }

  onPlayerChange(request: ChangePlayerRequest) {
    const position = this.position();
    if (position) {
      this.selectedPlayerChange.emit({ ...request, position: position });
    }
  }
}
