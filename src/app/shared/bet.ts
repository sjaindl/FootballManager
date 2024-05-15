import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Bet {
  matchday: string;
  home: string;
  away: string;
}

export const betConverter = {
  toFirestore: (bet: Bet) => {
    return {
      id: bet.matchday,
      home: bet.home,
      away: bet.away,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      matchday: snapshot.id,
      home: data['home'],
      away: data['away'],
    };
  },
};

export const sortBetsByMatchday = (first: Bet, second: Bet) => {
  const firstMatchday = first.matchday;
  const secondMatchday = second.matchday;
  if (firstMatchday > secondMatchday) return 1;
  if (firstMatchday < secondMatchday) return -1;
  else return 0;
};
