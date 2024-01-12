import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {

  @Output() clickEvent = new EventEmitter();

  @Input({ required: true }) label!: string;

  public onClick(): void {
    this.clickEvent.emit();
  }
}
