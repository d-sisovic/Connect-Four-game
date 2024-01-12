import { BadgeComponent } from '../../../ui/badge/badge.component';
import { IPlayerWin } from '../../../../ts/models/player-win.model';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
}
