import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

export const goalkeeper = 'Goalkeeper';
export const defender = 'Defender';
export const midfielder = 'Midfielder';
export const attacker = 'Attacker';

export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker';

export class PositionMapper {
  displayName(position: Position): string {
    switch (position) {
      case 'Goalkeeper':
        return 'Tormann';
      case 'Defender':
        return 'Verteidiger';
      case 'Midfielder':
        return 'Mittelfeldspieler';
      case 'Attacker':
        return 'Stürmer';
    }
  }
}

export type FirebaseResponse = DocumentData | (DocumentData & {});
export interface Player {
  playerId: string;
  name: string;
  position: Position;
  imageRef?: string;
}

export interface ChangePlayerRequest {
  newPlayerId: string;
  oldPlayerId: string;
}

export interface ChangePlayerRequestWrapper extends ChangePlayerRequest {
  position: Position;
}

export const playerConverter = {
  toFirestore: (player: Player) => {
    return {
      playerId: player.playerId,
      name: player.name,
      position: player.position,
      imageRef: player.imageRef,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return {
      playerId: data['playerId'],
      name: data['name'],
      position: data['position'],
      imageRef: data['imageRef'],
    };
  },
};
