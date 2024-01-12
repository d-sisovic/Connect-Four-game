import { IPlayerWinRowColumn } from "./player-win-row-column.model";

export interface IPlayerWin {
  firstPlayerWon: boolean;
  secondPlayerWon: boolean;
  winningIndexes: IPlayerWinRowColumn[];
}
