import { Player } from './common.model';

const lastNegativeNumber = { value: 0 };

export function getNextUniqueNegativeNumber() {
  lastNegativeNumber.value = lastNegativeNumber.value - 1;
  return lastNegativeNumber.value;
}

export function getUndefinedPlayer(): Player {
  return {
    name: 'No Player',
    playerId: `${getNextUniqueNegativeNumber()}`,
  };
}
