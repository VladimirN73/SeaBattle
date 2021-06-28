import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-debug-env',
  templateUrl: './debug-env.component.html',
  styleUrls: []
})
export class DebugEnvComponent implements OnInit {

  keys: string[] =[];
  values: any[] =[];

  constructor() { }

  ngOnInit(): void {
    Object.keys(environment).map( (key:string, i)=>{
      this.keys.push(key);
      var x = key as keyof typeof environment;
      this.values.push(environment[x]);
    })
  }

}
