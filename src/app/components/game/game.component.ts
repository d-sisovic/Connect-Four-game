import { GameMode } from '../../ts/enum/game-mode.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { BadgeComponent } from '../ui/badge/badge.component';
import { TableComponent } from './components/table/table.component';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

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
  private readonly activatedRoute = inject(ActivatedRoute);

  public playerMode!: GameMode;

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
