import { Player, Position } from './common.model';

const lastNegativeNumber = { value: 0 };

export function getNextUniqueNegativeNumber() {
  lastNegativeNumber.value = lastNegativeNumber.value - 1;
  return lastNegativeNumber.value;
}

export function getUndefinedPlayer(position: Position): Player {
  return {
    name: 'No Player',
    active: true,
    position: position,
    playerId: `${getNextUniqueNegativeNumber()}`,
    points: {},
  };
}

export function isUndefinedPlayer(player: Partial<Player>): boolean {
  return player.playerId?.startsWith('-') ?? true;
}
