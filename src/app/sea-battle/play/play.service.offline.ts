import { Injectable } from "@angular/core";
import { PlayServiceBase, PlayServiceInterface } from "./play.service.base";

@Injectable({providedIn:"root"})
export class PlayServiceOffline extends PlayServiceBase implements PlayServiceInterface {

  public whatNext(){
    if (!this.game.myMap.validateMap()){
      this.message="Set ships and press start";
    }

    if (this.game.isStarted){
      this.message = "Just play ...";
    }
  }

  onClick(i: number, j: number) {

    console.log("PlayServiceOffline onClick("+ i.toString() + ', ' + j.toString()+ ')');

    let currentValue =this.mySeaMap[i][j].value;
    let nextValue = 0;

    if (!this.game.isStarted)
    {
      if (currentValue==0){
        nextValue=1;
      }
    }

    if (this.game.isStarted)
    {
      nextValue = currentValue;
      if (currentValue==0) nextValue=10; // ship is missed
      if (currentValue==1) nextValue=2;  // ship is hitted
      if (currentValue==2) nextValue=1;  // ship is hitted
      if (currentValue==10) nextValue=0; // ship is missed

    }

    this.mySeaMap[i][j].value = nextValue;

  }

  onClickEnemy(i: number, j: number){
    console.log("PlayServiceOffline onClickEnemy("+ i.toString() + ', ' + j.toString()+ ')');

    if (!this.game.isStarted) return;


    let currentValue =this.enemySeaMap[i][j].value;
    let nextValue = 0;

    if (this.game.isStarted)
    {
      nextValue = currentValue;
      if (currentValue==0) nextValue=10; // ship is missed
      if (currentValue==10) nextValue=2;  // ship is hitted
      if (currentValue==2) nextValue=1;  // ship is hitted
      if (currentValue==1) nextValue=0; // ship is missed

    }
    this.enemySeaMap[i][j].value = nextValue;
  }

}
