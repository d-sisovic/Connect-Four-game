import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly board: WritableSignal<Array<boolean | null>[]> = signal([
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ]);

  private readonly firstPlayerPlaying: WritableSignal<boolean> = signal(true);

  constructor() { }

  public setCircleToBoard(column: number): void {
    let valueSet = false;
    const isFirstPlayer = this.isFirstPlayerPlaying();

    this.board.update(previous => previous
      .slice()
      .reverse()
      .map(data => {
        const emptyValue = data[column] === null;

        if (!emptyValue || valueSet) { return data; }

        valueSet = true;

        return data.map((value, index) => index !== column ? value : isFirstPlayer);
      })
      .slice()
      .reverse());
  }

  public toggleFirstPlayerPlaying(): void {
    this.firstPlayerPlaying.update(previous => !previous);
  }

  public isColumnFull(column: number): boolean {
    return this.board().every(data => data[column] !== null);
  }

  public get isFirstPlayerPlaying(): Signal<boolean> {
    return this.firstPlayerPlaying;
  }

  public get getBoard(): Signal<Array<boolean | null>[]> {
    return this.board;
  }
}
