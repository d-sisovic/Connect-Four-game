import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameMode } from '../../ts/enum/game-mode.enum';
import { PauseComponent } from '../pause/pause.component';
import { BadgeComponent } from '../ui/badge/badge.component';
import { IPlayerWin } from '../../ts/models/player-win.model';
import { UtilUiService } from '../../services/util-ui.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IPlayerScore } from '../../ts/models/player-score.model';
import { GameFlowService } from '../../services/game-flow.service';
import { TableComponent } from './components/table/table.component';
import { GameLogicService } from '../../services/game-logic.service';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, Signal, effect, inject } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    NgClass,
    BadgeComponent,
    TableComponent,
    PauseComponent,
    ScoreboardComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly utilUiService = inject(UtilUiService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly gameFlowService = inject(GameFlowService);
  private readonly gameLogicService = inject(GameLogicService);

  public playerMode!: GameMode;
  public winnerInfo!: IPlayerWin | null;

  public showPauseMenu!: Signal<boolean>;
  public playersScore!: Signal<IPlayerScore>;

  constructor() {
    effect(() => {
      const board = this.gameFlowService.getBoard();
      const winnerInfo = this.gameLogicService.doesGameHaveWinner(board);

      if (winnerInfo) {
        this.gameFlowService.setWinnerInfo(winnerInfo);
        return;
      }

      const drawCondition = this.gameLogicService.doesGameHaveDrawCondition(board);

      if (drawCondition) {
        this.gameFlowService.setDrawResult(true);
      }
    });
  }

  public ngOnInit(): void {
    this.watchSetWinnerInfo();

    this.showPauseMenu = this.utilUiService.getShowPauseMenu;
    this.playersScore = this.gameFlowService.getPlayerScores;
    this.playerMode = this.activatedRoute.snapshot.params['mode'];
  }

  private watchSetWinnerInfo(): void {
    this.gameFlowService.getWinnerInfo$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(winnerInfo => {
        this.winnerInfo = winnerInfo;
        this.cdRef.markForCheck();
      })
  }

  public onSelectMenu(): void {
    this.utilUiService.setShowPauseMenu(true);
  }

  public onRestartGame(): void {
    this.gameFlowService.restartGame();
  }

  public get getPlayerMode(): typeof GameMode {
    return GameMode;
  }
}
