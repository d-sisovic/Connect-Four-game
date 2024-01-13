import { Router } from '@angular/router';
import { UtilUiService } from '../../services/util-ui.service';
import { ButtonComponent } from '../ui/button/button.component';
import { GameFlowService } from '../../services/game-flow.service';
import { ButtonColor } from '../ui/button/ts/enums/button-color.enum';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-pause',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './pause.component.html',
  styleUrl: './pause.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PauseComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly utilUiService = inject(UtilUiService);
  private readonly gameFlowService = inject(GameFlowService);

  public ngOnInit(): void {
    this.gameFlowService.emitPauseInterval(true);
  }

  public onContinueGame(): void {
    // Resume counter interval only if game is still on (not being finished - draft/winner)
    if (!this.gameFlowService.isDrawEvent && !this.gameFlowService.getWinnerInfo) {
      this.gameFlowService.emitPauseInterval(false);
    }

    this.utilUiService.setShowPauseMenu(false);
  }

  public onRestartGame(): void {
    this.gameFlowService.restartGame();
    this.utilUiService.setShowPauseMenu(false);
  }

  public onQuitGame(): void {
    this.router.navigateByUrl('');
    this.utilUiService.setShowPauseMenu(false);
    this.gameFlowService.resetWholeGame();
  }

  public get getColor(): typeof ButtonColor {
    return ButtonColor;
  }
}
