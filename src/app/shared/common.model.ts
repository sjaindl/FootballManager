import { DocumentData } from 'firebase/firestore';

export type FirebaseResponse = DocumentData | (DocumentData & {});
