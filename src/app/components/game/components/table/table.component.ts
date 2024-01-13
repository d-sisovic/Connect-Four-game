import { AsyncPipe } from '@angular/common';
import { Observable, asapScheduler, tap } from 'rxjs';
import { TurnComponent } from '../turn/turn.component';
import { WinnerComponent } from '../winner/winner.component';
import { DrawComponent } from '../../../draw/draw.component';
import { GameMode } from '../../../../ts/enum/game-mode.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IPlayerWin } from '../../../../ts/models/player-win.model';
import { GameUiService } from '../../../../services/game-ui.service';
import { IPlayerScore } from '../../../../ts/models/player-score.model';
import { GameFlowService } from '../../../../services/game-flow.service';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import {
  AfterViewInit, inject, ChangeDetectionStrategy, Component,
  DestroyRef, ElementRef, Input, OnInit, QueryList, Renderer2,
  Signal, ViewChildren, OnDestroy, ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    AsyncPipe,
    DrawComponent,
    TurnComponent,
    WinnerComponent,
    ScoreboardComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input({ required: true }) mode!: GameMode;

  @ViewChildren('cell') cells!: QueryList<ElementRef>;

  private readonly renderer2 = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdRef = inject(ChangeDetectorRef);
  private readonly gameUiService = inject(GameUiService);
  private readonly gameFlowService = inject(GameFlowService);

  public animatedGrid!: boolean;
  public winnerInfo!: IPlayerWin | null;

  public gameCounter!: Signal<number>;
  public gridDisabled!: Signal<boolean>;
  public playersScore!: Signal<IPlayerScore>;
  public isFirstPlayerPlaying!: Signal<boolean>;

  public drawEvent$!: Observable<boolean>;

  constructor() { }

  public ngOnInit(): void {
    this.initGameCounter();
    this.watchSetDrawEvent();
    this.watchSetWinnerInfo();
    this.watchClearAllFields();
    this.watchChangeMarkerColors();
    this.watchClearCellMarkersEvent();

    this.gameCounter = this.gameFlowService.getGameCounter;
    this.gridDisabled = this.gameFlowService.getGridDisabled;
    this.playersScore = this.gameFlowService.getPlayerScores;
    this.isFirstPlayerPlaying = this.gameFlowService.isFirstPlayerTurn;
  }

  public ngOnDestroy(): void {
    this.gameFlowService.resetWholeGame();
  }

  public ngAfterViewInit(): void {
    this.gameFlowService.emitNewPlayerTurn();
  }

  public onGridClick(event: Event): void {
    if (this.gridDisabled()) { return; }

    const element = event.target as HTMLElement;

    if (!element.classList.contains('cell')) { return; }

    const { column } = element.dataset as { column: string, row: string };
    const parsedColumn = +column;

    this.gameFlowService.setCircleToBoard(parsedColumn);

    this.setCircleToCell(parsedColumn);
    this.gameFlowService.handleNextUserPlay();

    // Clears markers from the top if the column is full
    if (!this.isHoveredColumnFull(parsedColumn)) { return; }

    this.gameUiService.clearCellMarkers(this.cells);
  }

  public onMouseOverGrid(event: Event): void {
    if (this.gridDisabled()) { return; }

    this.gameUiService.clearCellMarkers(this.cells);

    const element = event.target as HTMLElement;

    if (!element.classList.contains('cell')) { return; }

    const column = element.dataset['column'] || '';
    const matchingElement = this.gameUiService.getMatchingElementByRowColumn(this.cells, '0', column);

    if (!matchingElement || this.isHoveredColumnFull(+column)) { return; }

    const markerElement = this.renderer2.createElement('span');

    this.gameUiService.setMarkerImage(markerElement, this.isFirstPlayerPlaying());
    this.renderer2.addClass(markerElement, 'marker');
    this.renderer2.appendChild(matchingElement.nativeElement, markerElement);
  }

  private watchSetWinnerInfo(): void {
    this.gameFlowService.getWinnerInfo$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(winnerInfo => {
        this.winnerInfo = winnerInfo;
        this.cdRef.markForCheck();

        if (!this.winnerInfo) { return; }

        this.handleWinnerCase();
      })
  }

  private watchSetDrawEvent(): void {
    this.drawEvent$ = this.gameFlowService.watchDrawEvent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(isDrawEvent => {
          if (!isDrawEvent) { return; }

          this.handleDrawCase();
        })
      );
  }

  private handleDrawCase(): void {
    this.gameUiService.clearCellMarkers(this.cells);

    this.pauseInterval();
    this.emitDisableGrid();
  }

  private handleWinnerCase(): void {
    this.gameUiService.clearCellMarkers(this.cells);

    this.updateScore();
    this.pauseInterval();
    this.emitDisableGrid();
    this.markWinnerCircles();
  }

  private emitDisableGrid(): void {
    this.gameFlowService.setGridDisabledState(true);
  }

  private pauseInterval(): void {
    this.gameFlowService.emitPauseInterval(true);
  }

  private updateScore(): void {
    asapScheduler.schedule(() => this.gameFlowService.updatePlayerScore((this.winnerInfo as IPlayerWin).firstPlayerWon));
  }

  private markWinnerCircles(): void {
    (this.winnerInfo as IPlayerWin).winningIndexes.forEach(item => {
      const { rowIndex, columnIndex } = item;
      const matchingElement = this.gameUiService.getMatchingElementByRowColumn(this.cells, rowIndex.toString(), columnIndex.toString());

      if (!matchingElement) { return; }

      const circleElement = this.renderer2.createElement('span');

      this.renderer2.addClass(circleElement, 'winner');
      this.renderer2.appendChild(matchingElement.nativeElement, circleElement);
    });
  }

  private watchChangeMarkerColors(): void {
    this.gameFlowService.watchForNewPlayerTurn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cells.forEach((cell, index) => {
          if (index > 6) { return; }

          this.gameUiService.changeMarkerColors(cell, this.isFirstPlayerPlaying());
        });
      })
  }

  private initGameCounter(): void {
    this.gameFlowService.initGameCounter$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private setCircleToCell(column: number): void {
    const rowIndex = this.gameFlowService.getBoard().findIndex(data => data[column] !== null);
    const matchingElement = this.gameUiService.getMatchingElementByRowColumn(this.cells, rowIndex.toString(), column.toString());

    if (!matchingElement) { return; }

    const circlePath = this.gameUiService.getCirclePath(this.isFirstPlayerPlaying());
    const circleElement = this.renderer2.createElement('span');

    this.renderer2.addClass(circleElement, 'circle');
    this.renderer2.addClass(circleElement, `circle--animation-${rowIndex}`);
    this.renderer2.setStyle(circleElement, 'content', `url('assets/images/${circlePath}.svg')`);
    this.renderer2.appendChild(matchingElement.nativeElement, circleElement);
  }

  private isHoveredColumnFull(column: number): boolean {
    return this.gameFlowService.isColumnFull(column);
  }

  private watchClearAllFields(): void {
    this.gameFlowService.watchClearAllFields$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.gameUiService.clearAllFields(this.cells))
  }

  private watchClearCellMarkersEvent(): void {
    this.gameUiService.watchClearCellMarkersEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.gameUiService.clearCellMarkers(this.cells))
  }

  public get getPlayerMode(): typeof GameMode {
    return GameMode;
  }
}
