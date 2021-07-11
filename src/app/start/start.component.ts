import { Component, OnInit } from '@angular/core';
import {environment } from '../../environments/environment'

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: []
})
export class StartComponent implements OnInit {

  title = 'SeaBattle';
  version = environment.version;
  envname = environment.name;
  buildAt = environment.buildAt;
  buildBranch = environment.buildBranch;

  constructor() { }

  ngOnInit(): void {

  }

}
