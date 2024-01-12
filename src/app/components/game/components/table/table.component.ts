import { GameMode } from '../../../../ts/enum/game-mode.enum';
import { GameService } from '../../../../services/game.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameFlowService } from '../../../../services/game-flow.service';
import {
  AfterViewInit, inject,
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef,
  Input, OnInit, QueryList, Renderer2, Signal, ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input({ required: true }) mode!: GameMode;

  @ViewChildren('cell') cells!: QueryList<ElementRef>;

  private readonly renderer2 = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly gameService = inject(GameService);
  private readonly gameFlowService = inject(GameFlowService);

  public gameCounter!: Signal<number>;
  public isFirstPlayerPlaying!: Signal<boolean>;

  constructor() { }

  public ngOnInit(): void {
    this.initGameCounter();
    this.watchChangeMarkerColors();

    this.gameCounter = this.gameFlowService.getGameCounter;
    this.isFirstPlayerPlaying = this.gameService.isFirstPlayerPlaying;
  }

  public ngAfterViewInit(): void {
    this.gameFlowService.emitNewPlayerTurn();
  }

  public onGridClick(event: Event): void {
    const element = event.target as HTMLElement;

    if (!element.classList.contains('cell')) { return; }

    const { column } = element.dataset as { column: string, row: string };
    const parsedColumn = +column;

    this.gameService.setCircleToBoard(parsedColumn);

    this.setCircleToCell(parsedColumn);
    this.gameFlowService.handleNextUserPlay();

    // Clears markers from the top if the column is full
    if (!this.isHoveredColumnFull(parsedColumn)) { return; }

    this.clearCellMarkers();
  }

  public onMouseOverGrid(event: Event): void {
    this.clearCellMarkers();

    const element = event.target as HTMLElement;

    if (!element.classList.contains('cell')) { return; }

    const column = element.dataset['column'] || '';
    const matchingElement = this.getMatchingElementByRowColumn('0', column);

    if (!matchingElement || this.isHoveredColumnFull(+column)) { return; }

    const markerElement = this.renderer2.createElement('span');

    this.setMarkerImage(markerElement);
    this.renderer2.addClass(markerElement, 'marker');
    this.renderer2.appendChild(matchingElement.nativeElement, markerElement);
  }

  private watchChangeMarkerColors(): void {
    this.gameFlowService.watchForNewPlayerTurn$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cells.forEach((cell, index) => {
          if (index > 6) { return; }

          Array
            .from(cell.nativeElement.children)
            .filter(child => this.isElementMarker(child))
            .forEach(markerElement => this.setMarkerImage(markerElement))
        });
      })
  }

  private setMarkerImage(markerElement: unknown): void {
    this.renderer2.setStyle(markerElement, 'content', `url('assets/images/${this.getMarkerPath}.svg')`)
  }

  private initGameCounter(): void {
    this.gameFlowService.initGameCounter()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private setCircleToCell(column: number): void {
    const rowIndex = this.gameService.getBoard().findIndex(data => data[column] !== null);
    const matchingElement = this.getMatchingElementByRowColumn(rowIndex.toString(), column.toString());

    if (!matchingElement) { return; }

    const circleElement = this.renderer2.createElement('span');

    this.renderer2.addClass(circleElement, 'circle');
    this.renderer2.addClass(circleElement, `circle--animation-${rowIndex}`);
    this.renderer2.setStyle(circleElement, 'content', `url('assets/images/${this.getCirclePath}.svg')`);
    this.renderer2.appendChild(matchingElement.nativeElement, circleElement);
  }

  private isHoveredColumnFull(column: number): boolean {
    return this.gameService.isColumnFull(column);
  }

  private getMatchingElementByRowColumn(elementRow: string, elementColumn: string): ElementRef<any> | null {
    return this.cells.find(item => {
      const { row, column } = item.nativeElement.dataset;

      return row === elementRow && column === elementColumn;
    }) || null;
  }

  private clearCellMarkers(): void {
    this.cells.forEach(cell => {
      Array
        .from(cell.nativeElement.children)
        .filter(child => this.isElementMarker(child))
        .forEach(child => this.renderer2.removeChild(cell.nativeElement, child));
    });
  }

  private isElementMarker(child: unknown): boolean {
    return (child as HTMLElement).classList.contains('marker');
  }

  private get getCirclePath(): string {
    const isMobileView = window.innerWidth <= 375;
    const circleSuffix = isMobileView ? 'small' : 'large';

    return this.isFirstPlayerPlaying() ? `counter-red-${circleSuffix}` : `counter-yellow-${circleSuffix}`;
  }

  private get getMarkerPath(): string {
    return this.isFirstPlayerPlaying() ? 'marker-red' : 'marker-yellow';
  }
}
