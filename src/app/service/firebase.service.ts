import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
} from '@angular/fire/firestore';
import { EMPTY, Observable } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';
import {
  FirebaseResponse,
  Player,
  playerConverter,
} from '../shared/common.model';
import { Formation, formationConverter } from '../shared/formation';
import { LinedUpPlayer } from '../shared/lineup';
import { LineupData, lineupDataConverter } from '../shared/lineupdata';
import { User, userConverter } from '../shared/user';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private readonly authStore = inject(AuthStore);

  constructor(private db: Firestore) {}

  // FAQs
  getFaqs(): Observable<FirebaseResponse[]> {
    const itemCollection = collection(this.db, '/faq/');

    return collectionData(itemCollection);
  }

  // Formations
  getFormations(): Observable<Formation[]> {
    const itemCollection = collection(this.db, '/formations/').withConverter(
      formationConverter
    );

    return collectionData(itemCollection);
  }

  // Players
  getPlayers(): Observable<Player[] | (Player[] & {})> {
    const itemCollection = collection(this.db, '/players/').withConverter(
      playerConverter
    );

    return collectionData(itemCollection);
  }

  // User
  userCollection = collection(this.db, '/users/').withConverter(userConverter);

  getUsers(): Observable<[User] | (User[] & {})> {
    return collectionData(this.userCollection);
  }

  getCurrentUser(): Observable<User | undefined> {
    const userId = this.getCurrentUserId();
    if (userId == null) {
      console.error('User ID is null');
      return EMPTY;
    }

    return this.getUser(userId);
  }

  getUser(uid: string): Observable<User | undefined> {
    const userDoc = this.getUserDoc(uid);

    return docData(userDoc);
  }

  getUserDoc(uid: string): DocumentReference<User> {
    return doc(this.userCollection, uid);
  }

  setUserData(
    uid: string,
    userName: string,
    email: string,
    providerId: string,
    photoUrl: string,
    formation: string,
    points: number,
    pointsLastRound: number
  ) {
    const userDoc = this.getUserDoc(uid);

    const docData = {
      uid: uid,
      userName: userName,
      email: email,
      providerId: providerId,
      photoUrl: photoUrl,
      formation: formation,
      points: points,
      pointsLastRound: pointsLastRound,
    };

    setDoc(userDoc, docData, { merge: true });
  }

  setFormation(formation: string) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.warn('User ID null when setting formation');
      return;
    }

    // get collection without converter, else Firebase complains about missing fields
    const userCollection = collection(this.db, '/users/');
    const userDoc = doc(userCollection, userId);

    const docData = {
      formation: formation,
      // booleanExample: true,
      // numberExample: 3.14159265,
      // dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
      // arrayExample: [5, true, "hello"],
      // nullExample: null,
      // objectExample: {
      //     a: 5,
      //     b: {
      //         nested: "foo"
      //     }
      // }
    };

    setDoc(userDoc, docData, { merge: true });
  }

  private getCurrentUserId(): string | undefined {
    const user = this.authStore.user;
    if (!user) {
      console.warn('User is null');
      return undefined;
    }

    const userId = user()?.uid;
    if (!userId) {
      console.warn('User ID is null');
      return undefined;
    }

    return userId;
  }

  getLineUp(): Observable<LineupData | undefined> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Cannot get lineup - User ID is null');
      return EMPTY;
    }

    const lineupCollection = collection(
      this.getUserDoc(userId),
      'lineup'
    ).withConverter(lineupDataConverter);

    const linedUpDataDoc = doc(lineupCollection, 'lineupData');

    return docData(linedUpDataDoc);
  }

  setLineup(lineup: LinedUpPlayer[]) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Cannot set lineup - User ID is null');
      return;
    }

    const lineupCollection = collection(this.getUserDoc(userId), 'lineup');

    var goalkeeperId: string = '';
    var defenderIds: string[] = [];
    var midfielderIds: string[] = [];
    var attackerIds: string[] = [];

    lineup.forEach(linedUpPlayer => {
      switch (linedUpPlayer.position) {
        case 'Goalkeeper':
          goalkeeperId = linedUpPlayer.playerId;
          break;

        case 'Defender':
          defenderIds.push(linedUpPlayer.playerId);
          break;
        case 'Midfielder':
          midfielderIds.push(linedUpPlayer.playerId);
          break;
        case 'Attacker':
          attackerIds.push(linedUpPlayer.playerId);
          break;
      }
    });

    const linedUpPlayerDoc = doc(lineupCollection, 'lineupData');

    const docData = {
      goalkeeper: goalkeeperId,
      defenders: defenderIds,
      midfielders: midfielderIds,
      attackers: attackerIds,
    };

    setDoc(linedUpPlayerDoc, docData, { merge: true });
  }
}
