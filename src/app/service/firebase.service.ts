import { Injectable, inject } from '@angular/core';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  collection,
  collectionCount,
  collectionData,
  doc,
  docData,
  orderBy,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { EMPTY, Observable, map } from 'rxjs';
import { AuthStore } from '../auth/store/auth.store';
import { Bet, betConverter } from '../shared/bet';
import {
  FirebaseResponse,
  Player,
  playerConverter,
} from '../shared/common.model';
import { Config, configConverter } from '../shared/config';
import { Formation, formationConverter } from '../shared/formation';
import { LinedUpPlayer } from '../shared/lineup';
import { LineupData, lineupDataConverter } from '../shared/lineupdata';
import { Matchday, matchdayConverter } from '../shared/matchday';
import { News, newsConverter } from '../shared/news';
import { User, userConverter } from '../shared/user';
import { UserData, userDataConverter } from '../shared/userdata';

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
  getPlayers(onlyActive: Boolean): Observable<Player[] | (Player[] & {})> {
    const itemCollection = collection(this.db, '/players/').withConverter(
      playerConverter
    );

    return collectionData(itemCollection).pipe(
      map(players => players.filter(player => player.active || !onlyActive))
    );
  }

  // User
  userCollection = collection(this.db, '/users/').withConverter(userConverter);

  getUsers(): Observable<User[] | (User[] & {})> {
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
    photoRef: string,
    formation: string,
    isAdmin: boolean
  ) {
    const userDoc = this.getUserDoc(uid);

    const docData = {
      uid: uid,
      userName: userName,
      email: email,
      providerId: providerId,
      photoUrl: photoUrl,
      photoRef: photoRef,
      formation: formation,
      isAdmin: isAdmin,
    };

    setDoc(userDoc, docData, { merge: true });
  }

  setUserName(userName: string) {
    const user = this.authStore.user();
    if (user) {
      if (userName === user.userName) {
        return;
      }

      const userDoc = this.getUserDoc(user.uid);

      const docData = {
        uid: user.uid,
        userName: userName,
        email: user.email,
        providerId: user.providerId,
        photoUrl: user.photoUrl,
        photoRef: user.photoRef,
        formation: user.formation,
        isAdmin: user.isAdmin,
      };

      setDoc(userDoc, docData, { merge: true });
    }
  }

  setUserPhotoRef(photoRef: string) {
    const user = this.authStore.user();
    if (user) {
      const userDoc = this.getUserDoc(user.uid);

      if (photoRef === user.photoRef) {
        return;
      }

      const docData = {
        uid: user.uid,
        userName: user.userName,
        email: user.email,
        providerId: user.providerId,
        photoUrl: user.photoUrl,
        photoRef: photoRef,
        formation: user.formation,
        isAdmin: user.isAdmin,
      };

      setDoc(userDoc, docData, { merge: true });
    }
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

  getUserMatchdayData(
    userId: string
  ): Observable<UserData[] | (UserData[] & {})> {
    const matchdaysCollection = collection(
      this.getUserDoc(userId),
      'matchdays'
    ).withConverter(userDataConverter);

    // this.debugInfo(matchdaysCollection);

    return collectionData(matchdaysCollection);
  }

  setUserMatchdayLineup(matchday: string) {
    this.getUsers().subscribe(users => {
      users.forEach(user => {
        this.getLineUpOfUser(user.uid).subscribe(lineupData => {
          if (lineupData) {
            const matchdaysCollection = collection(
              this.getUserDoc(user.uid),
              'matchdays'
            );
            const matchdayDoc = doc(matchdaysCollection, matchday);
            setDoc(matchdayDoc, lineupData, { merge: true });
          }
        });
      });
    });
  }

  saveUserMatchdayBet(matchday: string, homeScore: number, awayScore: number) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Cannot get lineup - User ID is null');
      return;
    }

    this.getLineUpOfUser(userId).subscribe(lineupData => {
      const matchdaysCollection = collection(
        this.getUserDoc(userId),
        'matchdays'
      );
      const matchdayDoc = doc(matchdaysCollection, matchday);
      let data: Partial<UserData>;
      if (lineupData) {
        data = {
          goalkeeper: lineupData.goalkeeper,
          defenders: lineupData.defenders,
          midfielders: lineupData.midfielders,
          attackers: lineupData.attackers,
          id: lineupData.id,
          homeScore: homeScore,
          awayScore: awayScore,
        };
      } else {
        data = {
          defenders: [],
          midfielders: [],
          attackers: [],
          homeScore: homeScore,
          awayScore: awayScore,
        };
      }
      setDoc(matchdayDoc, data, { merge: true });
    });
  }

  // Lineup

  getLineUp(): Observable<LineupData | undefined> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Cannot get lineup - User ID is null');
      return EMPTY;
    }

    return this.getLineUpOfUser(userId);
  }

  getLineUpOfUser(userId: string): Observable<LineupData | undefined> {
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

  // Matchdays
  getMatchdays(): Observable<Matchday[] | (Matchday[] & {})> {
    const matchDaysCollection = collection(this.db, 'matchDays').withConverter(
      matchdayConverter
    );

    const q = query(matchDaysCollection, orderBy('id')).withConverter(
      matchdayConverter
    );

    return collectionData(q);
  }

  addMatchday(matchday: string, index: number, opponent: string) {
    const matchDaysCollection = collection(this.db, 'matchDays').withConverter(
      matchdayConverter
    );

    const matchdayDoc = doc(matchDaysCollection, matchday);

    const docData = {
      index: index,
      opponent: opponent,
    };

    setDoc(matchdayDoc, docData, { merge: true });
  }

  setPlayerMatchdays(players: Player[], matchday: string) {
    const playersCollection = collection(this.db, 'players').withConverter(
      playerConverter
    );

    players.forEach(player => {
      const playerDoc = doc(playersCollection, player.playerId);
      const points = player.points ?? {};

      points[matchday] = player.pointsCurrentRound ?? 0;

      const docData = {
        playerId: player.playerId,
        name: player.name,
        position: player.position,
        imageRef: player.imageRef,
        points: points,
      };

      console.log(docData);

      setDoc(playerDoc, docData, { merge: true });
    });
  }

  // Bets
  getBets(): Observable<Bet[] | undefined> {
    const betsCollection = collection(this.db, 'bets').withConverter(
      betConverter
    );

    return collectionData(betsCollection);
  }

  setBet(
    matchday: string,
    homeScore: number,
    awayScore: number,
    home: string,
    away: string
  ) {
    const betsCollection = collection(this.db, 'bets').withConverter(
      betConverter
    );

    const betDoc = doc(betsCollection, matchday);

    const docData = {
      matchday: matchday,
      home: home,
      away: away,
      resultScoreAway: awayScore,
      resultScoreHome: homeScore,
    };

    setDoc(betDoc, docData, { merge: true });
  }

  // Config
  getConfig(): Observable<Config | undefined> {
    const configCollection = collection(this.db, 'config').withConverter(
      configConverter
    );

    const ref = doc(configCollection, 'config');

    return docData(ref);
  }

  setConfig(freeze: boolean, bets: boolean, season: string) {
    const configCollection = collection(this.db, 'config').withConverter(
      configConverter
    );

    const configDoc = doc(configCollection, 'config');

    const docData: Config = {
      freeze: freeze,
      bets: bets,
      season: season,
    };

    setDoc(configDoc, docData, { merge: true });
  }

  // News

  getNews(): Observable<News | (News & {})> {
    const newsCollection = collection(this.db, 'news').withConverter(
      newsConverter
    );

    const q = query(newsCollection).withConverter(newsConverter);

    return collectionData(q).pipe(map(news => news[0]));
  }

  setNews(news: News) {
    const newsCollection = collection(this.db, 'news').withConverter(
      newsConverter
    );

    const docData = {
      text: news.text,
    };

    const newsDoc = doc(newsCollection, 'news');

    setDoc(newsDoc, docData, { merge: true });
  }

  // Util

  debugInfo(collection: CollectionReference) {
    collectionCount(collection).subscribe(number => {
      console.log('count: ' + number);
    });

    collectionData(collection).subscribe(value => {
      console.log('entry: ' + JSON.stringify(value));
    });
  }
}
