import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export class Formation {
  formation: string;
  defense: number;
  midfield: number;
  attack: number;

  constructor(
    formation: string,
    defense: number,
    midfield: number,
    attack: number
  ) {
    this.formation = formation;
    this.defense = defense;
    this.midfield = midfield;
    this.attack = attack;
  }
}

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

    return new Formation(
      data['formation'],
      data['defense'],
      data['midfield'],
      data['attack']
    );
  },
};
