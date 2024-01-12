import { GameService } from './game.service';
import { IPlayerWin } from '../ts/models/player-win.model';
import { GameSettings } from '../ts/enum/game-settings.enum';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable, Subject, switchMap, tap, filter, map, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameFlowService {

  private gameService = inject(GameService);

  private isPaused = signal(false);
  private gameCounter = signal(GameSettings.PLAYER_TURN_LENGTH);

  private newPlayerTurn = new Subject<void>();
  private winnerInfo = new Subject<IPlayerWin>();

  constructor() { }

  public initGameCounter(): Observable<number> {
    return this.watchForNewPlayerTurn$
      .pipe(
        switchMap(() => timer(0, 1_000)),
        filter(() => !this.isPaused()),
        map(value => GameSettings.PLAYER_TURN_LENGTH - value),
        tap(value => {
          if (value === -1) {
            this.handleNextUserPlay();
            return;
          }

          this.gameCounter.set(value);
        })
      );
  }

  public emitNewPlayerTurn(): void {
    this.newPlayerTurn.next();
  }

  public get getGameCounter(): Signal<number> {
    return this.gameCounter;
  }

  public get watchForNewPlayerTurn$(): Observable<void> {
    return this.newPlayerTurn.asObservable();
  }

  public handleNextUserPlay(): void {
    this.gameService.toggleFirstPlayerPlaying();
    this.emitNewPlayerTurn();
  }

  public setWinnerInfo(winnerInfo: IPlayerWin): void {
    this.winnerInfo.next(winnerInfo);
  }

  public get getWinnerInfo$(): Observable<IPlayerWin> {
    return this.winnerInfo.asObservable();
  }
}
