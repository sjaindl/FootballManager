import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface User {
  uid: string;
  userName: string;
  email: string;
  providerId: string;
  // photoRef: string;
  photoUrl: string;

  formation: string;
  points: number;
  pointsLastRound: number;

  isAdmin: boolean;
}

export const userConverter = {
  toFirestore: (user: User) => {
    return {
      uid: user.uid,
      userName: user.userName,
      email: user.email,
      providerId: user.providerId,
      photoUrl: user.photoUrl,

      formation: user.formation,
      points: user.points,
      pointsLastRound: user.pointsLastRound,

      isAdmin: user.isAdmin,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      uid: data['uid'],
      userName: data['userName'],
      email: data['email'],
      providerId: data['providerId'],
      photoUrl: data['photoUrl'],

      formation: data['formation'],
      points: data['points'],
      pointsLastRound: data['pointsLastRound'],

      isAdmin: data['isAdmin'],
    };
  },
};
