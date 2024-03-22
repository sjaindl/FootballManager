import { Component, EventEmitter, Output, input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Formation, defaultFormation } from '../../../shared/formation';

@Component({
  selector: 's11-formation',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss',
})
export class FormationComponent {
  selectedFormation = input(defaultFormation);
  formations = input<Formation[]>([]);
  @Output() onFormationChange = new EventEmitter<Formation>();

  onValueChange(formation: Formation) {
    this.onFormationChange.emit(formation);
  }
}
