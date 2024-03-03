import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Formation } from '../../shared/formation';

@Component({
  selector: 's11-formation',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss',
})
export class FormationComponent {
  @Input() selectedFormation: Formation | null = null;
  @Input() formations: Formation[] | null = [];
}
