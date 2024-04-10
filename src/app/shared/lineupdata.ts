import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface LineupData {
  goalkeeper: string;
  defenders: string[];
  midfielders: string[];
  attackers: string[];
  id: string;
}

export const lineupDataConverter = {
  toFirestore: (lineupData: LineupData) => {
    return {
      goalkeeper: lineupData.goalkeeper,
      defenders: lineupData.defenders,
      midfielders: lineupData.midfielders,
      attackers: lineupData.attackers,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      goalkeeper: data['goalkeeper'],
      defenders: data['defenders'],
      midfielders: data['midfielders'],
      attackers: data['attackers'],
      id: snapshot.id,
    };
  },
};
