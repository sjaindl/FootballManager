import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface User {
  uid: string;
  userName: string;
  email: string;
  providerId: string;
  photoUrl: string;
  photoRef: string;
  formation: string;
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
      photoRef: user.photoRef,
      formation: user.formation,
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
      photoRef: data['photoRef'],
      formation: data['formation'],
      isAdmin: data['isAdmin'],
    };
  },
};
