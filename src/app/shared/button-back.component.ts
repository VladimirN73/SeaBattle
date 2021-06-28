import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button-back',
  template: '<button type="button" class="btn btn-success" (click)="onBack()">Back</button>'
})
export class ButtonBackComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBack(){
    this.router.navigate(['/']);
  }
}
