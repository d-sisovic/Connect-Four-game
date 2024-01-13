import { Router } from '@angular/router';
import { GameMode } from '../../ts/enum/game-mode.enum';
import { RoutePath } from '../../ts/enum/route-path.enum';
import { PauseComponent } from '../pause/pause.component';
import { ButtonComponent } from '../ui/button/button.component';
import { ButtonColor } from '../ui/button/ts/enums/button-color.enum';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    PauseComponent,
    ButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private readonly router = inject(Router);

  public onPlayVsCpu(): void {
    this.router.navigateByUrl(RoutePath.GAME + `/${GameMode.CPU}`);
  }

  public onPlayVsPlayer(): void {
    this.router.navigateByUrl(RoutePath.GAME + `/${GameMode.PLAYER}`);
  }

  public onReadGameRules(): void {
    this.router.navigateByUrl(RoutePath.RULES);
  }

  public get getColor(): typeof ButtonColor {
    return ButtonColor;
  }
}
