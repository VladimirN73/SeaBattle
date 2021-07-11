
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeaBattleComponent } from './sea-battle.component';
import { SeaBattleRoutingModule } from './sea-battle.routing';
import { SharedModule } from '../shared/shared.module';
import { PlayComponent } from './play/play.component';

@NgModule({
  declarations: [
      SeaBattleComponent,
      PlayComponent
  ],
  imports: [
      SeaBattleRoutingModule,
      SharedModule,
      CommonModule,
  ],
  exports: [
  ],
  providers: [
  ],
  bootstrap: []
})
export class SeaBattleModule{

}
