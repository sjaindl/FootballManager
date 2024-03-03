import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from '../service/firebase.service';
import { Formation } from '../shared/formation';
import { FormationComponent } from './formation/formation.component';
import { LineupRowComponent } from './lineup-row/lineup-row.component';

@Component({
  selector: 's11-lineup',
  standalone: true,
  imports: [FormationComponent, LineupRowComponent, CommonModule],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
})
export class LineupComponent {
  selectedPlayers = [
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
  ];

  formations$: Observable<Formation[]>;

  constructor(private firebaseService: FirebaseService) {
    this.formations$ = this.firebaseService.getFormations();
  }
}

// TODO:
//   1. Signal-Store für den Lineup
//   2. Event emitter
//   3. Changes in Store schreiben / Werte rauslesen
//   4. Firebase mit Store verknüpfen
//   5. Firebase Storage für Icons
//   6. Check keine doppelte Spielerauswahl (ausgewählte Spieler filtern & in player.component zum Array hinzufügen)

// Ideen: Admin - Abstimmung für Punkte, Historie/Statistiken per Spiel (Gegner, Ergebnis, Punkte pro Spieler..)
// Sum query für aggregate Punkte: https://firebase.google.com/docs/firestore/query-data/aggregation-queries#web-modular-api_3
// Firebase Store vorbereiten
