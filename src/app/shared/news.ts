import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export interface News {
  generalNews: string;
  matchdayNews: string;
  matchdayPhotoRef: string;
}

export const newsConverter = {
  toFirestore: (news: News) => {
    return {
      generalNews: news.generalNews,
      matchdayNews: news.matchdayNews,
      matchdayPhotoRef: news.matchdayPhotoRef,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return {
      generalNews: data['generalNews'],
      matchdayNews: data['matchdayNews'],
      matchdayPhotoRef: data['matchdayPhotoRef'],
    };
  },
};
