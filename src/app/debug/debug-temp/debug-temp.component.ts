import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeaStep, FirestoreService, convertToSeaStep} from '../../shared/firestore.service'

@Component({
  selector: 'app-debug-temp',
  templateUrl: './debug-temp.component.html',
  styleUrls: ['../debug-styles.scss']
})
export class DebugTempComponent implements OnInit, OnDestroy {

  data$!: Subscription;
  isLoading=false;

  message:string = "";

  constructor(private fire: FirestoreService) { }

  ngOnInit(): void {
  }

  onSave(name: string){
    let step = new SeaStep();

    step.info=1;
    step.row=1;
    step.col=1;
    step.player="host";


    this.fire.setNextStep(name, step);
  }

  onLoad(name:string){

    this.isLoading=false;
    this.message = "loading ..."

    this.data$ = this.fire.getNextStep(name).subscribe(
      val => { let x = convertToSeaStep(val);  this.handleVal(x)},
      err => this.handleErr(err)
    )
  }

  handleVal(seaStep:SeaStep){
    console.log(seaStep);
    this.message = JSON.stringify(seaStep);
  }

  handleErr(err:any){
    console.log(err);
    this.message = "error"
  }


  ngOnDestroy(): void {
    if (this.data$ != undefined){
      this.data$.unsubscribe();
    }
  }

}

