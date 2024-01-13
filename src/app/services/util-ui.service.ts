import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilUiService {

  private readonly showPauseMenu = signal(false);

  constructor() { }

  public setShowPauseMenu(showPauseMenu: boolean): void {
    this.showPauseMenu.set(showPauseMenu);
  }

  public get getShowPauseMenu(): Signal<boolean> {
    return this.showPauseMenu;
  }
}
