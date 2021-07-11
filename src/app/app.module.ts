import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// 1. Import Fire-Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
//import { AngularFireStorageModule } from '@angular/fire/storage';
//import { AngularFireAuthModule } from '@angular/fire/auth';

import { APP_ROUTES, EXTRA_OPTIONS } from './app.routes';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { StartComponent } from './start/start.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES, EXTRA_OPTIONS),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    
    // 3. Initialize
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    //AngularFireAuthModule, // auth
    //AngularFireStorageModule // storage
  ],
  providers: [
    { provide: DatePipe }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
