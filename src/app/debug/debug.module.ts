
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugComponent } from './debug.component';
import { DebugRoutingModule } from './debug-routing.module';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';
import { DebugButtonBackComponent } from './debug-button-back/debug-button-back.component';
import { DebugEnvComponent } from './debug-env/debug-env.component';
import { DebugTempComponent } from './debug-temp/debug-temp.component';
import { DebugFirestoreComponent } from './debug-firestore/debug-firestore.component';

@NgModule({
    declarations: [
        DebugComponent,
        DebugLogsComponent,
        DebugButtonBackComponent,
        DebugEnvComponent,
        DebugTempComponent,
        DebugFirestoreComponent
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
