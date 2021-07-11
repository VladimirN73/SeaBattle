import { Component, OnDestroy, OnInit } from '@angular/core';
import { SeaMap, SeaBattleGame, MapItem, SeaBattleService } from '../sea-battle.service';

import { PlayServiceInterface } from './play.service.base';
import { PlayServiceOffline } from './play.service.offline';
import { PlayServiceOnline } from './play.service.online';

@Component({
  selector: 'app-sea-battle-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  playService!: PlayServiceInterface;

  game: SeaBattleGame = new SeaBattleGame();

  mySeaMapClass!:SeaMap;
  enemySeaMapClass!:SeaMap;

  mySeaMap!: MapItem[][];
  enemySeaMap!: MapItem[][];

  message="";
  messageEnemy="";

  isOnline = true;

  constructor(
    private offlineService: PlayServiceOffline,
    private onlineService: PlayServiceOnline,
    private seaBattleService: SeaBattleService) { }

  ngOnInit(): void {
    console.log('PlayComponent.ngOnInit()');
    this.loadLastGame();
  }

  private loadLastGame()
  {
    console.log("PlayComponent.loadLastGame()");
    let lastGame:SeaBattleGame;
    lastGame = this.seaBattleService.loadLastGame();

    if (lastGame==undefined)
    {
      lastGame = new SeaBattleGame();
      lastGame.gamename="";
      lastGame.myname="";
    }

    if (lastGame.myMap==undefined){
      lastGame.myMap = new SeaMap(lastGame.rows, lastGame.cols);
    }

    if (lastGame.enemyMap==undefined){
      lastGame.enemyMap = new SeaMap(lastGame.rows, lastGame.cols);
    }

    this.game.copyGame(lastGame);

    this.setValuesByGame();
  }

  setValuesByGame(){
    this.mySeaMapClass = this.game.myMap;
    this.enemySeaMapClass = this.game.enemyMap;
    this.mySeaMap = this.mySeaMapClass.sMap;
    this.enemySeaMap = this.enemySeaMapClass.sMap;
    this.isOnline = this.game.isOnline;

    if (this.isOnline)
    {
      this.playService =this.onlineService;
    }
    else
    {
      this.playService = this.offlineService;
    }


    this.playService.setGame(this.game);
    this.playService.whatNext();
  }

  saveLastGame(){
    localStorage.setItem("lastGame", JSON.stringify(this.game));
  }

  getItemClassBase(i: number, j: number, map: MapItem[][], isLastStep:boolean = false){
    let currentValue =map[i][j].value;

    let retValue: string = this.getBoxClass();

    switch (currentValue){

      case 1: retValue += ' sea-ship-missed'; break;
      case 2: retValue += ' sea-ship-marked'; break;

      case 10: retValue += ' sea-ship'; break;
      case 11: retValue += ' sea-ship-hitted'; break;
      case 12: retValue += ' sea-ship-dead'; break;

      default: retValue += ''
    }

    if (isLastStep)
    {
      retValue += " last-step";
    }

    return retValue;

  }

  getBoxText(i: number, j: number){
    const lastStep = this.game.lastStepOnMyMap;
    const isLastStep =
      lastStep != undefined &&
      lastStep.row == i &&
      lastStep.col == j;
    return this.getItemClassBase(i,j,this.mySeaMap, isLastStep)
  }

  getBoxTextEnemy(i: number, j: number){
    const lastStep = this.game.lastStepOnEnemyMap;
    const isLastStep =
      lastStep != undefined &&
      lastStep.row == i &&
      lastStep.col == j;
    return this.getItemClassBase(i,j,this.enemySeaMap, isLastStep)
  }

  getText(i:number, j:number)
  {
    const Symbols:string[]=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O']

    if (i==0 && j==0) return "A1";
    if (j==0) return Symbols[i];
    if (i==0) return j+1;
    return;
  }

  onClick(i: number, j: number)
  {
    this.playService.onClick(i,j);

    this.saveLastGame();
  }


  onClickEnemy(i: number, j: number)
  {
    this.playService.onClickEnemy(i,j);
    this.saveLastGame();
  }

  onValidate()
  {
    var isValid = this.mySeaMapClass.validateMap();
    if (!isValid) {
      this.message = "invalid"
    } else {
      this.message = "valid"
    }
  }

  onReset()
  {
    if(!confirm("Are you sure to reset")) return;
    this.game.gamename="";
    this.game.myname="";
    this.game.myMap.reset();
    this.game.enemyMap.reset();
    this.game.isStarted = false;
    this.setValuesByGame();
    this.saveLastGame();
  }

  onRandom(){
    if (this.game.isStarted){
      return;
    }

    this.game.myMap.RandomMap();
    this.saveLastGame();
  }

  onStart(){
    var isValid = this.mySeaMapClass.validateMap();
    if (!isValid) {
      confirm("Map is invalid");
      return;
    }

    // now freeze edit
    this.game.isStarted = true;
    this.playService.whatNext();
    this.saveLastGame();

  }

  onRefresh(){
    this.playService.onRefresh();
  }

  getRowClass()
  {
     if (this.game.cols==12)
     {
       return "sea-row-12";
     }

     return "sea-row";
  }

  getBoxClass()
  {
    if (this.game.cols==12)
    {
      return "sea-box-12";
    }

    if (this.game.cols==15)
    {
      return "sea-box-15";
    }

     return "sea-box";
  }

  ngOnDestroy(): void {
    console.log("PlayComponent.ngOnDestroy()");
    if (this.playService)
    {
      this.playService.onDestroy();
    }
  }

}


