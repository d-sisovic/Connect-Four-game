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
    const winColumn = this.getCpuWinColumn(board);

    if (winColumn !== null) { return winColumn; }

    const columnByRow = this.getCpuColumn(board, this.doesPlayerHaveNRowMatches(board));
    const columnByColumn = this.getCpuColumn(board, this.doesPlayerHaveNColumnMatches(board));
    const columnNumber = this.findColumnNumber(columnByRow, columnByColumn);

    return typeof columnNumber === 'number' ? columnNumber : this.getRandomColumnIndex(board);
  }

  // Checks when there is one more empty spot for the win, and provides column of that spot
  public getCpuWinColumn(board: (boolean | null)[][]): number | null {
    const columnByRow = this.getCpuColumn(board, this.doesPlayerHaveNRowMatches(board, false));
    const columnByColumn = this.getCpuColumn(board, this.doesPlayerHaveNColumnMatches(board, false));
    const columnNumber = this.findColumnNumber(columnByRow, columnByColumn);

    return typeof columnNumber === 'number' ? columnNumber : null;
  }

  public emitMarkRandomCircleEvent(randomColumnIndex: number): void {
    this.markRandomCircleEvent.next(randomColumnIndex);
  }

  public get watchMarkRandomCircleEvent$(): Observable<number> {
    return this.markRandomCircleEvent.asObservable();
  }

  private findColumnNumber(columnByRow: number | null, columnByColumn: number | null): number | null | undefined {
    return [columnByRow, columnByColumn].find(value => typeof value === 'number');
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

  private doesPlayerHaveNRowMatches(board: (boolean | null)[][], firstPlayer: boolean = true): IPlayerWinRowColumn[] {
    return board
      .map((row, rowIndex) => this.findConsecutiveIndexOfPlayer(row, rowIndex, firstPlayer))
      .find(rowData => rowData.length) || [];
  }

  private doesPlayerHaveNColumnMatches(board: (boolean | null)[][], firstPlayer: boolean = true): IPlayerWinRowColumn[] {
    const transformedRows = this.gameLogicService.transformColumnsToRows(board);
    const rowMatches = this.doesPlayerHaveNRowMatches(transformedRows, firstPlayer);
    const manualWinnerInfo = { firstPlayerWon: false, secondPlayerWon: false, winningIndexes: rowMatches };

    return this.gameLogicService.flipColumnWinningIndexes(manualWinnerInfo)?.winningIndexes || [];
  }

  private findConsecutiveIndexOfPlayer(row: Array<boolean | null>, rowIndex: number, firstPlayer: boolean): IPlayerWinRowColumn[] {
    // Algorithm will look to fill gap when there is [null, true, true, true] or [true, true, true, null] per x/y axis, hence it will need 4 places
    const iterator = this.gameLogicService.getIteratorFromCirclesToWin(4);

    for (let i = 0; i <= row.length; i++) {
      const currentNextValues = iterator.map((_, index) => row[i + index]);
      const doesHaveRowMatching = this.doesHaveMatch(currentNextValues, firstPlayer);

      if (doesHaveRowMatching) {
        return iterator.map((_, index) => ({ rowIndex, columnIndex: i + index }));
      }
    }

    return [];
  }

  private doesHaveMatch(values: (boolean | null)[], firstPlayer: boolean): boolean {
    return this.isFirstValueNullAndOthersTrue(values, firstPlayer) || this.isLastValueNullAndOthersTrue(values, firstPlayer);
  }

  private isFirstValueNullAndOthersTrue(values: (boolean | null)[], firstPlayer: boolean): boolean {
    const [firstValue] = values;
    const allExceptFirstValues = values.slice(1, values.length);

    return firstValue === null && allExceptFirstValues.every(value => firstPlayer ? value : value === false);
  }

  private isLastValueNullAndOthersTrue(values: (boolean | null)[], firstPlayer: boolean): boolean {
    const lastValue = values[values.length - 1];
    const allExceptLastValues = values.slice(0, values.length - 1);

    return lastValue === null && allExceptLastValues.every(value => firstPlayer ? value : value === false);
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
