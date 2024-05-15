import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface UserData {
  goalkeeper: string;
  defenders: string[];
  midfielders: string[];
  attackers: string[];
  homeScore: number | undefined;
  awayScore: number | undefined;
  id: string;
}

export const userDataConverter = {
  toFirestore: (userData: UserData) => {
    return {
      goalkeeper: userData.goalkeeper,
      defenders: userData.defenders,
      midfielders: userData.midfielders,
      attackers: userData.attackers,
      homeScore: userData.homeScore,
      awayScore: userData.awayScore,
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
      homeScore: data['homeScore'],
      awayScore: data['awayScore'],
      id: snapshot.id,
    };
  },
};
