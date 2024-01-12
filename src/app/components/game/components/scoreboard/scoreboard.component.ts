import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreboardComponent {

  @Input() score!: number;
  @Input({ required: true }) label!: string;
}
