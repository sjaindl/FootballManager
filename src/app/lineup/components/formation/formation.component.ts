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
import { MatSelectModule } from '@angular/material/select';
import { Formation } from '../../../shared/formation';

@Component({
  selector: 's11-formation',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss',
})
export class FormationComponent implements OnChanges {
  @Input() selectedFormation: Partial<Formation> = {};
  @Input() formations: Formation[] = [];
  @Output() onFormationChange = new EventEmitter<Formation>();

  formation$: WritableSignal<Partial<Formation>> = signal({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formation']) {
      this.formation$.set(this.selectedFormation);
    }
  }

  onValueChange(formation: Formation) {
    this.onFormationChange.emit(formation);
  }
}
