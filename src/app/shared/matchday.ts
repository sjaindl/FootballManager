import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Matchday {
  id: string;
  points: number;

  //admin area properties:
  pointsCurrentRound?: number;
}

export const matchdayConverter = {
  toFirestore: (matchday: Matchday) => {
    return {
      id: matchday.id,
      points: matchday.points,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      points: data['points'],
      pointsCurrentRound: data['pointsCurrentRound'],
      id: snapshot.id,
    };
  },
};
