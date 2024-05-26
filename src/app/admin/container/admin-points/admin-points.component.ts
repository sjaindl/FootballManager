import { Component, Signal, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Matchday } from '../../../shared/matchday';
import { MatchdayComponent } from '../../components/matchday-points/matchday-points.component';
import { MatchdayStore } from '../../store/matchday.store';

@Component({
  selector: 's11-admin',
  standalone: true,
  imports: [MatTabsModule, MatchdayComponent],
  templateUrl: './admin-points.component.html',
  styleUrl: './admin-points.component.scss',
})
export class AdminPointsComponent {
  readonly matchdayStore = inject(MatchdayStore);

  matchdays: Signal<Matchday[] | undefined>;

  constructor() {
    this.matchdays = this.matchdayStore.matchdays;
  }
}
