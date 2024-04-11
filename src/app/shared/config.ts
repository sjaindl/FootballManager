import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Config {
  freeze: boolean | undefined;
}

export const configConverter = {
  toFirestore: (config: Config) => {
    return {
      freeze: config.freeze,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      freeze: data['freeze'],
    };
  },
};
