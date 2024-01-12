import { Injectable } from '@angular/core';
import { IPlayerWin } from '../ts/models/player-win.model';
import { GameSettings } from '../ts/enum/game-settings.enum';
import { IPlayerWinRowColumn } from '../ts/models/player-win-row-column.model';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  constructor() { }

  public doesGameHaveWinningIndexes(board: (boolean | null)[][]): IPlayerWin | null {
    const rowsHaveWinner = this.doesRowHaveWinner(board);
    const columnsHaveWinner = this.doesRowHaveWinner(this.transformColumnsToRows(board));

    return rowsHaveWinner || columnsHaveWinner;
  }

  public doesRowHaveWinner(board: (boolean | null)[][]): IPlayerWin | null {
    return board
      .map((row, rowIndex) => {
        const firstPlayerIndexes = this.findConsecutiveIndex(row, rowIndex, true);
        const secondPlayerIndexes = this.findConsecutiveIndex(row, rowIndex, false);

        return {
          firstPlayerWon: !!firstPlayerIndexes.length,
          secondPlayerWon: !!secondPlayerIndexes.length,
          winningIndexes: firstPlayerIndexes || secondPlayerIndexes
        };
      })
      .find(item => item.winningIndexes.length) || null;
  }

  public transformColumnsToRows(board: (boolean | null)[][]): (boolean | null)[][] {
    const rowsLength = board.length;
    const columnsLength = board[0].length;

    return Array
      .from({ length: columnsLength })
      .map((_, columnIndex) => Array.from({ length: rowsLength }).map((_, rowIndex) => board[rowIndex][columnIndex]))
  }

  private findConsecutiveIndex(row: Array<boolean | null>, rowIndex: number, firstPlayer: boolean): IPlayerWinRowColumn[] {
    for (let i = 0; i <= row.length; i++) {
      const currentNextValuesSame = Array
        .from({ length: GameSettings.CIRCLE_FOR_WIN })
        .map((_, index) => row[i + index]);

      if (currentNextValuesSame.every(value => firstPlayer ? value : value === false)) {
        return Array
          .from({ length: GameSettings.CIRCLE_FOR_WIN })
          .map((_, index) => ({ rowIndex, columnIndex: i + index }));
      }
    }

    return [];
  }
}
