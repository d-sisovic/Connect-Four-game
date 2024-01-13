import { Observable, Subject } from 'rxjs';
import { GameSettings } from '../ts/enum/game-settings.enum';
import { ElementRef, Injectable, QueryList, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameUiService {

  private readonly renderer2: Renderer2;

  private readonly clearCellMarkersEvent = new Subject<void>();

  constructor(
    public readonly rendererFactory: RendererFactory2
  ) {
    this.renderer2 = rendererFactory.createRenderer(null, null);
  }

  public clearAllChildrenFromCell(cell: ElementRef<any>): void {
    Array
      .from(cell.nativeElement.children)
      .forEach(child => this.renderer2.removeChild(cell.nativeElement, child));
  }

  public clearMarkerFromCell(cell: ElementRef<any>): void {
    Array
      .from(cell.nativeElement.children)
      .filter(child => this.isElementMarker(child))
      .forEach(child => this.renderer2.removeChild(cell.nativeElement, child));
  }

  public changeMarkerColors(cell: ElementRef<any>, isFirstPlayerPlaying: boolean): void {
    Array
      .from(cell.nativeElement.children)
      .filter(child => this.isElementMarker(child))
      .forEach(markerElement => this.setMarkerImage(markerElement, isFirstPlayerPlaying));
  }

  public getCirclePath(isFirstPlayerPlaying: boolean): string {
    const isMobileView = window.innerWidth <= GameSettings.MOBILE_VIEWPORT;
    const circleSuffix = isMobileView ? 'small' : 'large';

    return isFirstPlayerPlaying ? `counter-red-${circleSuffix}` : `counter-yellow-${circleSuffix}`;
  }

  public clearAllFields(cells: QueryList<ElementRef>): void {
    cells.forEach(cell => this.clearAllChildrenFromCell(cell));
  }

  public clearCellMarkers(cells: QueryList<ElementRef>): void {
    cells.forEach(cell => this.clearMarkerFromCell(cell));
  }

  public getMatchingElementByRowColumn(cells: QueryList<ElementRef>, elementRow: string, elementColumn: string): ElementRef<any> | null {
    return cells.find(item => {
      const { row, column } = item.nativeElement.dataset;

      return row === elementRow && column === elementColumn;
    }) || null;
  }

  public setMarkerImage(markerElement: unknown, isFirstPlayerPlaying: boolean): void {
    this.renderer2.setStyle(markerElement, 'content', `url('assets/images/${this.getMarkerPath(isFirstPlayerPlaying)}.svg')`)
  }

  public emitClearCellMarkersEvent(): void {
    this.clearCellMarkersEvent.next();
  }

  private isElementMarker(child: unknown): boolean {
    return (child as HTMLElement).classList.contains('marker');
  }

  private getMarkerPath(isFirstPlayerPlaying: boolean): string {
    return isFirstPlayerPlaying ? 'marker-red' : 'marker-yellow';
  }

  public get watchClearCellMarkersEvent$(): Observable<void> {
    return this.clearCellMarkersEvent.asObservable();
  }
}
