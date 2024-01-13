import { GameMode } from '../../../../ts/enum/game-mode.enum';
import { GameFlowService } from '../../../../services/game-flow.service';
import { ChangeDetectionStrategy, Component, Input, OnInit, Signal, inject } from '@angular/core';

@Component({
  selector: 'app-turn',
  standalone: true,
  imports: [],
  templateUrl: './turn.component.html',
  styleUrl: './turn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TurnComponent implements OnInit {

  @Input({ required: true }) mode!: GameMode;

  private readonly gameFlowService = inject(GameFlowService);

  public gameCounter!: Signal<number>;
  public isFirstPlayerPlaying!: Signal<boolean>;

  public ngOnInit(): void {
    this.gameCounter = this.gameFlowService.getGameCounter;
    this.isFirstPlayerPlaying = this.gameFlowService.isFirstPlayerTurn;
  }
}
