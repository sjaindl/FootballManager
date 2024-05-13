import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Mvp } from '../../../shared/mvp';

@Component({
  selector: 's11-stats-item',
  standalone: true,
  imports: [MatCardModule, MatListModule],
  templateUrl: './stats-item.component.html',
  styleUrl: './stats-item.component.scss',
})
export class StatsItemComponent {
  title = input<string>();
  mvps = input<Mvp[]>([]);
}
