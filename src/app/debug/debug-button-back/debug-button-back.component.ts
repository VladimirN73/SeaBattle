import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debug-button-back',
  template: '<button type="button" class="btn btn-success" (click)="onBack()">Back</button>',
  styleUrls: ['../debug-styles.scss']

})
export class DebugButtonBackComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onBack(){
    this.router.navigate(['/debug']);
  }

}
