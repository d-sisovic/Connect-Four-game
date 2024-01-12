import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RulesComponent {

  private readonly router = inject(Router);

  public onGoBack(): void {
    this.router.navigateByUrl('');
  }
}
