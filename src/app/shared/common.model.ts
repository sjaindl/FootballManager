import { DocumentData } from 'firebase/firestore';

export type FirebaseResponse = DocumentData | (DocumentData & {});
export interface Player {
  playerId: string;
  name: string;
  iconUrl?: string;
}
