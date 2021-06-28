import { applySourceSpanToExpressionIfNeeded } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SeaStep, FirebaseService} from '../../shared/firebase.service'

@Component({
  selector: 'app-debug-temp',
  templateUrl: './debug-temp.component.html',
  styleUrls: ['../debug-styles.scss']
})
export class DebugTempComponent implements OnInit, OnDestroy {

  data$!: Subscription;
  isLoading=false;

  message:string = "";

  constructor(private firebase: FirebaseService) { }

  ngOnInit(): void {
  }

  onSave(name: string){
    let step = new SeaStep();

    step.info=1;
    step.row=1;
    step.col=1;
    step.player="host";


    this.firebase.setNextStep(name, step);
  }

  onLoad(name:string){

    this.isLoading=false;
    this.message = "loading ..."

    this.data$ = this.firebase.getNextStep(name).subscribe(
      val=> this.handleVal(val),
      err=> this.handleErr(err)
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

