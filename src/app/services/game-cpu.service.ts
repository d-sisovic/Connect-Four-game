import { Observable, Subject } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { GameLogicService } from './game-logic.service';
import { IPlayerWinRowColumn } from '../ts/models/player-win-row-column.model';

@Injectable({
  providedIn: 'root'
})
export class GameCpuService {

  private readonly gameLogicService = inject(GameLogicService);

  public readonly markRandomCircleEvent = new Subject<number>();

  constructor() { }

  public getNextCpuMove(board: (boolean | null)[][]): number | null {
    const columnByRow = this.getCpuColumn(board, this.doesPlayerHaveNRowMatches(board));
    const columnByColumn = this.getCpuColumn(board, this.doesPlayerHaveNColumnMatches(board));

    const columnNumber = [columnByRow, columnByColumn].find(value => typeof value === 'number');

    if (columnNumber !== undefined) { return columnNumber; }

    return this.getRandomColumnIndex(board);
  }

  public emitMarkRandomCircleEvent(randomColumnIndex: number): void {
    this.markRandomCircleEvent.next(randomColumnIndex);
  }

  public get watchMarkRandomCircleEvent$(): Observable<number> {
    return this.markRandomCircleEvent.asObservable();
  }

  private getCpuColumn(board: (boolean | null)[][], values: IPlayerWinRowColumn[]): number | null {
    for (let i = 0; i < values.length; i++) {
      const { rowIndex, columnIndex } = values[i];
      const boardValue = board[rowIndex][columnIndex];

      if (boardValue === null) {
        return columnIndex;
      }
    }

    return null;
  }

  private doesPlayerHaveNRowMatches(board: (boolean | null)[][]): IPlayerWinRowColumn[] {
    return board
      .map((row, rowIndex) => this.findConsecutiveIndexOfPlayer(row, rowIndex))
      .find(rowData => rowData.length) || [];
  }

  private doesPlayerHaveNColumnMatches(board: (boolean | null)[][]): IPlayerWinRowColumn[] {
    const transformedRows = this.gameLogicService.transformColumnsToRows(board);
    const rowMatches = this.doesPlayerHaveNRowMatches(transformedRows);
    const manualWinnerInfo = { firstPlayerWon: false, secondPlayerWon: false, winningIndexes: rowMatches };

    return this.gameLogicService.flipColumnWinningIndexes(manualWinnerInfo)?.winningIndexes || [];
  }

  private findConsecutiveIndexOfPlayer(row: Array<boolean | null>, rowIndex: number): IPlayerWinRowColumn[] {
    // Algorithm will look to fill gap when there is [null, true, true, true] or [true, true, true, null] per x/y axis, hence it will need 4 places
    const iterator = this.gameLogicService.getIteratorFromCirclesToWin(4);

    for (let i = 0; i <= row.length; i++) {
      const currentNextValues = iterator.map((_, index) => row[i + index]);
      const doesHaveRowMatching = this.doesHaveMatch(currentNextValues);

      if (doesHaveRowMatching) {
        return iterator.map((_, index) => ({ rowIndex, columnIndex: i + index }));
      }
    }

    return [];
  }

  private doesHaveMatch(values: (boolean | null)[]): boolean {
    return this.isFirstValueNullAndOthersTrue(values) || this.isLastValueNullAndOthersTrue(values);
  }

  private isFirstValueNullAndOthersTrue(values: (boolean | null)[]): boolean {
    const [firstValue] = values;
    const allExceptFirstValues = values.slice(1, values.length);

    return firstValue === null && allExceptFirstValues.every(value => value);
  }

  private isLastValueNullAndOthersTrue(values: (boolean | null)[]): boolean {
    const lastValue = values[values.length - 1];
    const allExceptLastValues = values.slice(0, values.length - 1);

    return lastValue === null && allExceptLastValues.every(value => value);
  }

  private getRandomColumnIndex(board: (boolean | null)[][]): number | null {
    const [firstRow] = board;
    const maxNumber = board.length;
    const filledIndexes = this.getIndexOfFilledValuesInRow(firstRow);

    if (!filledIndexes.length) { return this.generateRandomColumnIndex(maxNumber); }

    let randomNumber: number;

    do {
      randomNumber = Math.floor(Math.random() * (maxNumber + 1));
    } while (filledIndexes.includes(randomNumber));

    return randomNumber;
  }

  private getIndexOfFilledValuesInRow(row: (boolean | null)[]): number[] {
    return row.reduce((accumulator, value, index) => value !== null ? [...accumulator, index] : accumulator, [] as number[]);
  }

  private generateRandomColumnIndex(rowLength: number): number {
    return Math.floor(Math.random() * rowLength);
  }
}
