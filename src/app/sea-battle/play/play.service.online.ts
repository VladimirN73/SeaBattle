
import { PlayServiceBase, PlayServiceInterface } from "./play.service.base";
import { convertToSeaStep, SeaStep } from "src/app/shared/firestore.service";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { SeaItemInfo, SeaBattleGame, SeaBattleService, MapCoordinates } from "../sea-battle.service";
import { DebugService } from "src/app/debug/debug.service";
import { FirestoreService } from "src/app/shared/firestore.service";
import { convertSnaps } from "src/app/debug/debug-firestore/debug-firestore.component";
import { Action } from "rxjs/internal/scheduler/Action";
import { DocumentSnapshot } from "@angular/fire/firestore";

@Injectable({providedIn:"root"})
export class PlayServiceOnline extends PlayServiceBase implements PlayServiceInterface {

  subNextStep: Subscription | undefined;

  constructor(
    private fire: FirestoreService, 
    private seaBattleService: SeaBattleService,
    debug: DebugService)
  { 
    super("PlayServiceOnline", debug);
  }

  public setGame(game: SeaBattleGame): void
  {
    super.setGame(game);
  }

  onClick(i: number, j: number)
  {
    this.log("onClick("+ i.toString() + ', ' + j.toString()+ ')');

    if (this.game.isStarted)
    {
      return;
    }

    //TODO partial copy-paste from offline
    let currentValue =this.mySeaMap[i][j].value;
    let nextValue = SeaItemInfo.Empty;

    if (!this.game.isStarted)
    {
      if (currentValue==SeaItemInfo.Empty){
        nextValue=SeaItemInfo.Ship;
      }
    }
    this.mySeaMap[i][j].value = nextValue;
  }

  onClickEnemy(i:number, j:number)
  {
    this.log("onClickEnemy("+ i.toString() + ', ' + j.toString()+ ')');

    if (!this.game.isStarted)
    {
      return;
    }

    if (this.game.isWaiting)
    {
      return;
    }

    this.game.lastStepOnEnemyMap = new MapCoordinates(i,j);

    let currentValue =this.enemySeaMap[i][j].value;
    if (currentValue!=SeaItemInfo.Empty)
    {
      return;
    }
    this.enemySeaMap[i][j].value = SeaItemInfo.EmptyHitted;

    let step = this.createSeaStep();
    step.row = i;
    step.col = j;
    step.info = SeaItemInfo.Fire;
    this.fire.setNextStep(this.game.gamename, step);

    this.startWaiting();
  }

  onEnemyHitted(i:number, j:number, isdead: boolean = false)
  {
    this.log("onEnemyHitted("+ i.toString() + ', ' + j.toString()+ ')');

    if (!this.game.isStarted) return;

    this.stopWaiting();

    //if (!this.game.isWaiting) return;

    let currentValue =this.enemySeaMap[i][j].value;
    if (currentValue!=SeaItemInfo.EmptyHitted)
    {
      return;
    }

    this.enemySeaMap[i][j].value = SeaItemInfo.ShipHitted;
    if (isdead)
    {
      this.enemySeaMapClass.markShipDead(i, j);
    }
    this.stopWaiting();
  }

  onClickOnline(i: number, j: number)
  {
    this.log('onClickOnline(' + i.toString + ',' + j.toString() + ')');

    this.game.lastStepOnMyMap = new MapCoordinates(i,j);

    let currentValue =this.mySeaMap[i][j].value;
    let nextValue = 0;

    // empty or fired-empty
    if (currentValue==SeaItemInfo.Empty ||
        currentValue==SeaItemInfo.EmptyHitted) nextValue=SeaItemInfo.EmptyHitted;

    // ship or fired-ship
    if (currentValue==SeaItemInfo.Ship ||
        currentValue==SeaItemInfo.ShipHitted) {
      nextValue=SeaItemInfo.ShipHitted;
    }

    this.mySeaMap[i][j].value = nextValue;

    if (this.game.myMap.isDead(i,j))
    {
      nextValue=SeaItemInfo.ShipDead;
      this.game.myMap.markShipDead(i,j);
    }

    // ship hitted/dead
    if (nextValue==SeaItemInfo.ShipHitted || nextValue==SeaItemInfo.ShipDead ){
      let step = this.createSeaStep();
      step.info = nextValue; // my ship hitted/dead
      step.row = i;
      step.col = j;
      this.fire.setNextStep(this.game.gamename, step);
    }

    if (nextValue==SeaItemInfo.EmptyHitted){

      let step = this.createSeaStep();
      step.info = SeaItemInfo.ArmyShallFire; // empty hitted
      step.player = this.game.myname;
      step.row = 0;
      step.col = 0;
      this.fire.setNextStep(this.game.gamename, step);
    }

    this.seaBattleService.saveLastGame(this.game);
    this.startWaiting();
  }

  getNextStep(){

    if (this.subNextStep != undefined) return;

    this.subNextStep = this.fire.getNextStep(this.game.gamename).subscribe(
      val => { let x = this.convert(val); this.handleValue(x); },
      err => { this.log(err); }
    );
  }

  convert(doc:any)
  {
    let ret = doc as SeaStep;

    return ret;
  }

  handleValue(val:SeaStep)
  {
    this.log("handleValue", val);

    let step = this.createSeaStep();

    // if not connected yet, then ignore/rewrite possible garbage step from last game
    if (!this.game.isConnected) {
      this.log("create seaStep - WaitingForSecondPlayerConnected");

      this.game.isConnected = true;

      step.info= SeaItemInfo.WaitingForSecondPlayerConnected; //waiting
      this.fire.setNextStep(this.game.gamename, step);
      //this.startWaiting();
      return;
    }


    if (val==undefined)
    {
        // cannot be, that the val==undefined and game.isconnected
        this.log("Error: val==undefined and game.isconnected");
    }

    if (val.info==SeaItemInfo.WaitingForSecondPlayerConnected){

      if (val.player==this.game.myname){
        this.log("waiting second player connection");
        //this.startWaiting();
        return;
      }

      this.log("other player is waiting for my connection");

      this.game.enemyName = val.player;
      this.game.isConnected = true;

      let iStart = SeaBattleService.getRandomInt(2);

      step.info = SeaItemInfo.ArmyShallFire;
      if (iStart==0) // the other player shall start
      {
        step.player = this.game.enemyName
      }
      else
      {
        step.player = this.game.myname;
      }
      this.fire.setNextStep(this.game.gamename, step);
      //this.startWaiting();
      return;
    }

    if ( val.info == SeaItemInfo.ArmyShallFire &&
         val.player==this.game.myname )
    {
      this.stopWaiting();
      return;
    }

    if (val.player==this.game.myname) {
      this.startWaiting();
      return;
    }

    this.game.enemyName = val.player;

    // -- fire
    if (val.info == SeaItemInfo.Fire) {

      this.onClickOnline(val.row, val.col);
      return;
    }

    if (val.info == SeaItemInfo.ShipHitted) {
      this.onEnemyHitted(val.row, val.col);
      return;
    }

    if (val.info == SeaItemInfo.ShipDead) {
      this.onEnemyHitted(val.row, val.col, true);
      return;
    }
  }

  onRefresh(){
    this.getNextStep();
  }

  public whatNext()
  {
    this.log('whatNext()');
    if (!this.game.myMap.validateMap() || !this.game.isStarted){
      this.message="Set ships and press start";
      return;
    }

    this.startWaiting();

    // inform system that we are waiting
    let step = this.createSeaStep();
    this.fire.setNextStep(this.game.gamename,step); // update game to just simulate/initiate the getNextStep
    
  }

  private createSeaStep(): SeaStep
  {
    let step = new SeaStep();
    step.player = this.game.myname;
    return step;
  }

  startWaiting()
  {
    this.log('startWaiting()');
    this.message = "waithing other player";

    if (this.game.isWaiting==true) return;    
    this.game.isWaiting = true;
    this.seaBattleService.saveLastGame(this.game);
  
    // if (this.subNextStep) this.subNextStep.unsubscribe();

    // this.subNextStep = this.fire.getNextStep(this.game.gamename).subscribe(
    //     val => { let x = convertToSeaStep(val); this.handleValue(x); },
    //     err => { this.log(err); }     
    // );

    this.getNextStep();

  }

  stopWaiting(){
    this.log('stopWaiting()');
    this.message = "make your step";
    this.game.isWaiting = false;
    this.seaBattleService.saveLastGame(this.game);
    //if (this.subNextStep) this.subNextStep.unsubscribe();
  }

  onDestroy()
  {
    this.log('onDestroy()');
    if (this.subNextStep) this.subNextStep.unsubscribe();
  }

}

