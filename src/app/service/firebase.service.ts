import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseResponse } from '../shared/common.model';
import { Formation, formationConverter } from '../shared/formation';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private db: Firestore) {}

  // FAQs
  getFaqs(): Observable<FirebaseResponse[]> {
    const itemCollection = collection(this.db, '/faq/');

    return collectionData(itemCollection);
  }

  // Formations
  getFormations(): Observable<Formation[] | (Formation[] & {})> {
    const itemCollection = collection(this.db, '/formations/').withConverter(
      formationConverter
    );

    return collectionData(itemCollection);
  }
}
