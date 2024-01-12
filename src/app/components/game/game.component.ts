import { GameMode } from '../../ts/enum/game-mode.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { BadgeComponent } from '../ui/badge/badge.component';
import { GameFlowService } from '../../services/game-flow.service';
import { TableComponent } from './components/table/table.component';
import { GameLogicService } from '../../services/game-logic.service';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    BadgeComponent,
    TableComponent,
    ScoreboardComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly gameFlowService = inject(GameFlowService);
  private readonly gameLogicService = inject(GameLogicService);

  public playerMode!: GameMode;

  constructor() {
    effect(() => {
      const board = this.gameService.getBoard();
      const winnerInfo = this.gameLogicService.doesGameHaveWinningIndexes(board);

      if (!winnerInfo) { return; }

      this.gameFlowService.setWinnerInfo(winnerInfo);
    });
  }

  public ngOnInit(): void {
    this.playerMode = this.activatedRoute.snapshot.params['mode'];
  }

  public onSelectMenu(): void {
    this.router.navigateByUrl('');
  }

  public onRestartGame(): void {

  }

  public get getPlayerMode(): typeof GameMode {
    return GameMode;
  }
}
