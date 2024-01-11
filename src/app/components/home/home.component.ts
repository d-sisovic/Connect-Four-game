import { Router } from '@angular/router';
import { RoutePath } from '../../ts/enum/route-path.enum';
import { ButtonComponent } from '../ui/button/button.component';
import { ButtonColor } from '../ui/button/ts/enums/button-color.enum';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  private router = inject(Router);

  public onPlayVsCpu(): void {

  }

  public onPlayVsPlayer(): void {

  }

  public onReadGameRules(): void {
    this.router.navigateByUrl(RoutePath.RULES);
  }

  public get getColor(): typeof ButtonColor {
    return ButtonColor;
  }
}
