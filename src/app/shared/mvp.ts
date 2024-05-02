export interface Mvp {
  playerName: string;
  points: number;
}

export const sortMvpByPoints = (first: Mvp, second: Mvp) => {
  const firstPoints = first.points;
  const secondPoints = second.points;
  if (firstPoints > secondPoints) return -1;
  if (firstPoints < secondPoints) return 1;
  else return 0;
};
