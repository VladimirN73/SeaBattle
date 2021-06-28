import { Component, OnInit } from '@angular/core';
import {environment } from '../../environments/environment'

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: []
})
export class StartComponent implements OnInit {

  version = environment.version;

  constructor() { }

  ngOnInit(): void {

  }

}
