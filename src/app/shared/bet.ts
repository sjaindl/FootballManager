import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Bet {
  matchday: string;
  home: string;
  away: string;
  resultScoreHome: number | undefined;
  resultScoreAway: number | undefined;
}

export const betConverter = {
  toFirestore: (bet: Bet) => {
    return {
      id: bet.matchday,
      home: bet.home,
      away: bet.away,
      resultScoreHome: bet.resultScoreHome,
      resultScoreAway: bet.resultScoreAway,
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
      resultScoreHome: data['resultScoreHome'],
      resultScoreAway: data['resultScoreAway'],
    };
  },
};

export const sortBetsByMatchday = (first: Bet, second: Bet) => {
  const firstMatchday = first.matchday;
  const secondMatchday = second.matchday;

  const firstMatchdayNum = parseInt(firstMatchday.split('_')[1], 10);
  const secondMatchdayNum = parseInt(secondMatchday.split('_')[1], 10);

  if (firstMatchdayNum > secondMatchdayNum) return 1;
  if (firstMatchdayNum < secondMatchdayNum) return -1;
  else return 0;
};
