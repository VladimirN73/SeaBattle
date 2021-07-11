import { DebugService } from "src/app/debug/debug.service";
import { MapItem, SeaBattleGame, SeaMap } from "../sea-battle.service";

export class PlayServiceBase {
  message!: string;
  game!: SeaBattleGame;

  mySeaMapClass!: SeaMap;
  enemySeaMapClass!:SeaMap;
  mySeaMap!:MapItem [][];
  enemySeaMap!: MapItem [][];

  constructor(private cls:string, private debug:DebugService)
  {
  }

  log(str: string | any, message?: string | any)
  {
    this.debug.log(this.cls + "." + str, message);
  }

  public setGame(game: SeaBattleGame){
    this.game = game;

    this.mySeaMapClass = this.game.myMap;
    this.enemySeaMapClass = this.game.enemyMap;
    this.mySeaMap = this.mySeaMapClass.sMap;
    this.enemySeaMap = this.enemySeaMapClass.sMap;
  }

  public whatNext(){
    if (!this.game.myMap.validateMap()){
      this.message="Set ships and press start";
    }
  }

  public onRefresh(){

  }

  public onDestroy(){}
}

export interface PlayServiceInterface {
  message:string;

  setGame(game: SeaBattleGame):void;
  whatNext():void;

  onClick(i:number, j:number):void;
  onClickEnemy(i:number, j:number):void;
  onRefresh():void;
  onDestroy():void;
}
