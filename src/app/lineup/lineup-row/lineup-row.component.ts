import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Player } from '../../shared/common.model';
import { PlayerComponent } from '../../shared/player/player.component';

@Component({
  selector: 's11-lineup-row',
  standalone: true,
  imports: [MatExpansionModule, PlayerComponent],
  templateUrl: './lineup-row.component.html',
  styleUrl: './lineup-row.component.scss',
})
export class LineupRowComponent implements OnChanges {
  @Input() rowTitle: string = '';
  @Input() maxNumOfPlayers: number = 0;
  @Input() selectedPlayers: Player[] = [];
  @Input() playerList: Player[] = [];

  players$: WritableSignal<Partial<Player>[]> = signal([]);

  panelOpenState = false;

  playerList$: WritableSignal<Player[]> = signal([
    {
      playerId: '1',
      name: 'Such dir einen aus',
      iconUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfb_ZY_Ct9P_hjsfv0jw07jKjmhw84CFRskppPps47iLqIKBKPI78OB0k&usqp=CAU',
    },
    {
      playerId: '2',
      name: 'Georg',
      iconUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfb_ZY_Ct9P_hjsfv0jw07jKjmhw84CFRskppPps47iLqIKBKPI78OB0k&usqp=CAU',
    },
    {
      playerId: '3',
      name: 'Stefan',
      iconUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfb_ZY_Ct9P_hjsfv0jw07jKjmhw84CFRskppPps47iLqIKBKPI78OB0k&usqp=CAU',
    },
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    const lineupRow: Partial<Player>[] = [...this.selectedPlayers];

    for (
      let num = this.selectedPlayers.length;
      num < this.maxNumOfPlayers;
      num++
    ) {
      lineupRow.push({
        name: 'No Player',
      });
    }

    this.players$.set(lineupRow);
  }
}
