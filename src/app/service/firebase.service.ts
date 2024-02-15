import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseResponse } from '../shared/common.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private db: Firestore) {}
  // FAQ
  getFaqs(): Observable<FirebaseResponse[]> {
    const itemCollection = collection(this.db, '/faq/');
    return collectionData(itemCollection);
  }
}
