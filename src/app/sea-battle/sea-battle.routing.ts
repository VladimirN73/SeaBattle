import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SeaBattleComponent} from './sea-battle.component'
import { PlayComponent } from './play/play.component';

const appRoutes: Routes =[
  { path : '', component : SeaBattleComponent },
  { path : 'play', component : PlayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class SeaBattleRoutingModule
{

}
