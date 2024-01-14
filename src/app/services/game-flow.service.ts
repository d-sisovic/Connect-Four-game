import { GameUiService } from './game-ui.service';
import { IPlayerWin } from '../ts/models/player-win.model';
import { GameSettings } from '../ts/enum/game-settings.enum';
import { IBoardStore } from '../ts/models/board-store.model';
import { IPlayerScore } from '../ts/models/player-score.model';
import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Observable, Subject, switchMap, tap, filter, map, timer, asapScheduler, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameFlowService {

  private readonly gameUiService = inject(GameUiService);

  private readonly emptyBoard = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]
  ];

  private readonly inititalBoardStore = {
    isPaused: false,
    gridDisabled: false,
    firstPlayerTurn: true,
    board: this.emptyBoard,
    firstPlayerPlayed: true,
    gameCounter: GameSettings.PLAYER_TURN_LENGTH,
    playersScore: { playerOneScore: 0, playerTwoScore: 0 }
  };

  private readonly boardStore: WritableSignal<IBoardStore> = signal(this.inititalBoardStore);

  private readonly newPlayerTurn = new Subject<void>();
  private readonly clearAllFields = new Subject<void>();
  private readonly drawEvent = new BehaviorSubject<boolean>(false);
  private readonly winnerInfo = new BehaviorSubject<IPlayerWin | null>(null);

  constructor() { }

  public initGameCounter$(): Observable<number> {
    return this.watchForNewPlayerTurn$
      .pipe(
        switchMap(() => timer(0, 1_000)),
        filter(() => !this.boardStore().isPaused),
        map(() => this.boardStore().gameCounter - 1),
        tap(value => {
          if (value === -1) {
            this.handleGameOnTimeout();
            return;
          }

          this.boardStore.update(previous => ({ ...previous, gameCounter: value }));
        })
      );
  }

  public updatePlayerScore(playerOneWon: boolean): void {
    this.boardStore.update(previous => {
      const { playersScore } = previous;
      const { playerOneScore, playerTwoScore } = playersScore;

      return {
        ...previous,
        playersScore: {
          playerOneScore: playerOneScore + (playerOneWon ? 1 : 0),
          playerTwoScore: playerTwoScore + (playerOneWon ? 0 : 1),
        }
      };
    });
  }

  public emitNewPlayerTurn(): void {
    this.newPlayerTurn.next();
  }

  public handleNextUserPlay(): void {
    // Sets game counter to initial value - 15seconds
    this.resetGameCounter();
    // Flips the player turn, so the first one which played previous round, now plays second
    this.toggleFirstPlayerPlaying();
    // Resets interval from the start
    this.emitNewPlayerTurn();
  }

  public setWinnerInfo(winnerInfo: IPlayerWin | null): void {
    this.winnerInfo.next(winnerInfo);
  }

  public setDrawResult(isDraw: boolean): void {
    this.drawEvent.next(isDraw);
  }

  public setCircleToBoard(column: number): void {
    let valueSet = false;
    const isFirstPlayer = this.isFirstPlayerTurn();

    this.boardStore.update(previous => {
      const board = previous.board
        .slice()
        .reverse()
        .map(data => {
          const emptyValue = data[column] === null;

          if (!emptyValue || valueSet) { return data; }

          valueSet = true;

          return data.map((value, index) => index !== column ? value : isFirstPlayer);
        })
        .slice()
        .reverse();

      return { ...previous, board };
    });
  }

  public toggleFirstPlayerPlaying(): void {
    this.boardStore.update(previous => ({ ...previous, firstPlayerTurn: !previous.firstPlayerTurn }));
  }

  public isColumnFull(column: number): boolean {
    return this.boardStore().board.every(data => data[column] !== null);
  }

  public emitPauseInterval(isPaused: boolean): void {
    asapScheduler.schedule(() => this.boardStore.update(previous => ({ ...previous, isPaused })));
  }

  public restartGame(playNextMode: boolean = false): void {
    // Clear draw scenario
    this.setDrawResult(false);
    // Sets no winner, so that player turn counter is shown
    this.setWinnerInfo(null);
    // Clear all cell's children
    this.emitClearAllFields();
    // Resets board store to set values
    this.boardStore.update(previous => ({
      ...previous,
      isPaused: false,
      gridDisabled: false,
      board: this.emptyBoard,
      gameCounter: GameSettings.PLAYER_TURN_LENGTH,
      firstPlayerTurn: !previous.firstPlayerPlayed,
      firstPlayerPlayed: !previous.firstPlayerPlayed
    }));

    if (!playNextMode) {
      // Resets both user score to 0, if mode is restart
      this.resetUsersScore();
    }
    // Resets interval from the start
    this.emitNewPlayerTurn();
  }

  public emitClearAllFields(): void {
    this.clearAllFields.next();
  }

  public clearBoard(): void {
    this.boardStore.update(previous => ({ ...previous, board: this.emptyBoard }));
  }

  public setGridDisabledState(gridDisabled: boolean = true): void {
    asapScheduler.schedule(() => this.boardStore.update(previous => ({ ...previous, gridDisabled })));
  }

  public resetWholeGame(): void {
    this.setWinnerInfo(null);
    this.setDrawResult(false);

    this.boardStore.set(this.inititalBoardStore);
  }

  public get getBoard(): Signal<Array<boolean | null>[]> {
    return computed(() => this.boardStore().board);
  }

  public get getGameCounter(): Signal<number> {
    return computed(() => this.boardStore().gameCounter);
  }

  public get getPlayerScores(): Signal<IPlayerScore> {
    return computed(() => this.boardStore().playersScore);
  }

  public get getGridDisabled(): Signal<boolean> {
    return computed(() => this.boardStore().gridDisabled);
  }

  public get isFirstPlayerTurn(): Signal<boolean> {
    return computed(() => this.boardStore().firstPlayerTurn);
  }

  public get isGamePaused(): Signal<boolean> {
    return computed(() => this.boardStore().isPaused);
  }

  public get isDrawEvent(): boolean {
    return this.drawEvent.getValue();
  }

  public get getWinnerInfo(): IPlayerWin | null {
    return this.winnerInfo.getValue();
  }

  public get watchDrawEvent$(): Observable<boolean> {
    return this.drawEvent.asObservable();
  }

  public get getWinnerInfo$(): Observable<IPlayerWin | null> {
    return this.winnerInfo.asObservable();
  }

  public get watchForNewPlayerTurn$(): Observable<void> {
    return this.newPlayerTurn.asObservable();
  }

  public get watchClearAllFields$(): Observable<void> {
    return this.clearAllFields.asObservable();
  }

  private handleGameOnTimeout(): void {
    const winnerPlayer = !this.boardStore().firstPlayerTurn;

    this.emitPauseInterval(true);
    this.setGridDisabledState(true);
    this.gameUiService.emitClearCellMarkersEvent();
    this.setWinnerInfo({ firstPlayerWon: winnerPlayer, secondPlayerWon: !winnerPlayer, winningIndexes: [] });
  }

  private resetGameCounter(): void {
    this.boardStore.update(previous => ({ ...previous, gameCounter: GameSettings.PLAYER_TURN_LENGTH }));
  }

  private resetUsersScore(): void {
    this.boardStore.update(previous => ({ ...previous, playersScore: { playerOneScore: 0, playerTwoScore: 0 } }));
  }
}
