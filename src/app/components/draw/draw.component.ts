import { BadgeComponent } from '../ui/badge/badge.component';
import { GameFlowService } from '../../services/game-flow.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawComponent {

  private readonly gameFlowService = inject(GameFlowService);

  public onPlayAgain(): void {
    this.gameFlowService.restartGame(true);
  }
}
