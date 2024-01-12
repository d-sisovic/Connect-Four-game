import { Routes } from '@angular/router';
import { RoutePath } from './ts/enum/route-path.enum';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { RulesComponent } from './components/rules/rules.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: RoutePath.GAME + '/:mode', component: GameComponent },
  { path: RoutePath.RULES, component: RulesComponent },
  { path: '**', redirectTo: '' }
];
