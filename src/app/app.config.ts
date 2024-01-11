import { routes } from './app.routes';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withViewTransitions())]
};
