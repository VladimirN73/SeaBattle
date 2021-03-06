
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DebugComponent } from './debug.component';
import { DebugLogsComponent } from './debug-logs/debug-logs.component';
import { DebugEnvComponent } from './debug-env/debug-env.component';
import { DebugTempComponent } from './debug-temp/debug-temp.component';
import { DebugFirestoreComponent } from './debug-firestore/debug-firestore.component';

const appRoutes: Routes =[
    { path : '', component : DebugComponent },
    { path:'logs', component: DebugLogsComponent },
    { path:'env', component: DebugEnvComponent },
    { path:'temp', component: DebugTempComponent },
    { path:'firestore', component: DebugFirestoreComponent },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class DebugRoutingModule
{

}
