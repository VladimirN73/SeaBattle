
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugComponent } from './debug.component';
import { DebugRoutingModule } from './debug-routing.module';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';
import { DebugButtonBackComponent } from './debug-button-back/debug-button-back.component';
import { DebugEnvComponent } from './debug-env/debug-env.component';
import { DebugTempComponent } from './debug-temp/debug-temp.component';

@NgModule({
    declarations: [
        DebugComponent,
        DebugLogsComponent,
        DebugButtonBackComponent,
        DebugEnvComponent,
        DebugTempComponent
    ],
    imports: [
        DebugRoutingModule,
        CommonModule,
    ],
    exports: [
    ],
    providers: [
    ],
    bootstrap: []
  })
export class DebugModule{

}
