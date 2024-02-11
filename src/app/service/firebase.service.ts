import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FirebaseResponse } from '../shared/common.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private db: Firestore) {}
  // constructor() {}
  // FAQ
  getFaq(): Observable<FirebaseResponse[]> {
    const itemCollection = collection(this.db, '/faq/');
    const a = collectionData(itemCollection);
    return collectionData(itemCollection);
  }

  // getFaq(): any {
  //   return [{ question: 'foo', answer: 'bar' }];
  // }
}
