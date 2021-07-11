
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonBackComponent } from './button-back.component';

@NgModule({
    declarations:[
      ButtonBackComponent,
    ],
    imports: [ CommonModule],
    exports: [
        ButtonBackComponent,
        CommonModule,
    ]
})
export class SharedModule{

}
