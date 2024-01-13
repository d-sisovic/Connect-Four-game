import { NgClass } from '@angular/common';
import { ButtonColor } from './ts/enums/button-color.enum';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {

  @Output() clickEvent = new EventEmitter();

  @Input() centeredText: boolean = false;
  @Input({ required: true }) label!: string;
  @Input() color: ButtonColor = ButtonColor.RED;

  public onButtonClick(): void {
    this.clickEvent.emit();
  }

  public get getColor(): typeof ButtonColor {
    return ButtonColor;
  }
}
