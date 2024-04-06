import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Matchday {
  id: string;
  opponent: string;
}

export const matchdayConverter = {
  toFirestore: (matchday: Matchday) => {
    return {
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
      opponent: data['opponent'],
    };
  },
};
