import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Matchday {
  id: string;
  index: number;
  opponent: string;
}

export const matchdayConverter = {
  toFirestore: (matchday: Matchday) => {
    return {
      id: matchday.index,
      opponent: matchday.opponent,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      index: data['id'],
      opponent: data['opponent'],
    };
  },
};
