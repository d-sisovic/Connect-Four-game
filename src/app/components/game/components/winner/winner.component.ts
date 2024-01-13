import { BadgeComponent } from '../../../ui/badge/badge.component';
import { IPlayerWin } from '../../../../ts/models/player-win.model';
import { GameFlowService } from '../../../../services/game-flow.service';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-winner',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './winner.component.html',
  styleUrl: './winner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WinnerComponent {

  @Input({ required: true }) winnerInfo!: IPlayerWin;

  private readonly gameFlowService = inject(GameFlowService);

  public onPlayAgain(): void {
    this.gameFlowService.restartGame(true);
  }
}
