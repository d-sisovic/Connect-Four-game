import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [NgClass],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreboardComponent {

  @Input() score!: number;
  @Input() ownScore!: boolean;
  @Input() desktopMode!: boolean;
  @Input({ required: true }) label!: string;
}
