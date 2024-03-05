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
  @Input() rowTitle: string = '';
  @Input() position?: Position;
  @Input() maxNumOfPlayers: number = 0;
  @Input() selectedPlayers: Player[] = [];
  @Input() playerList: Player[] = [];
  @Output() selectedPlayerChange =
    new EventEmitter<ChangePlayerRequestWrapper>();

  players$: WritableSignal<Partial<Player>[]> = signal([]);

  panelOpenState = false;

  playerList$: WritableSignal<Player[]> = signal([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxNumOfPlayers'] || changes['selectedPlayers']) {
      this.setPlayer();
    }
    if (changes['playerList']) {
      this.playerList$.set(this.playerList);
    }
  }

  onPlayerChange(request: ChangePlayerRequest) {
    if (this.position) {
      this.selectedPlayerChange.emit({ ...request, position: this.position });
    }
  }

  private setPlayer() {
    // const lineupRow: Partial<Player>[] = [...this.selectedPlayers];
    // for (
    //   let num = this.selectedPlayers.length;
    //   num < this.maxNumOfPlayers;
    //   num++
    // ) {
    //   lineupRow.push(getUndefinedPlayer());
    // }
    // this.players$.set(lineupRow);
    this.players$.set(this.selectedPlayers);
  }
}
