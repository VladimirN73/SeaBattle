import { ExtraOptions, PreloadAllModules, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component:StartComponent },
  { path: 'app-route', component:AppComponent },
  {
    path:'debug',
    loadChildren: () => import('./debug/debug.module').then(m => m.DebugModule)
  },
  {
    path:'sea-battle',
    loadChildren: () => import('./sea-battle/sea-battle.module').then(m => m.SeaBattleModule)
  },

  { path: '**', redirectTo: '/app-root' }
];

export const EXTRA_OPTIONS: ExtraOptions = {
  useHash: false,
  enableTracing: false,
  preloadingStrategy: PreloadAllModules,  // PreloadAllModules or NoPreloading (the default).,
  relativeLinkResolution: 'legacy'
};