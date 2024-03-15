import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface Formation {
  formation: string;
  defense: number;
  midfield: number;
  attack: number;
}

export const defaultFormation: Formation = {
  formation: '4-4-2',
  defense: 4,
  midfield: 4,
  attack: 2,
};

export const formationConverter = {
  toFirestore: (formation: Formation) => {
    return {
      formation: formation.formation,
      defense: formation.defense,
      midfield: formation.midfield,
      attack: formation.attack,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      formation: data['formation'],
      defense: data['defense'],
      midfield: data['midfield'],
      attack: data['attack'],
    };
  },
};
