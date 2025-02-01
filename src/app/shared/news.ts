import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface News {
  text: string;
}

export const newsConverter = {
  toFirestore: (news: News) => {
    return {
      text: news.text,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      text: data['text'],
    };
  },
};
