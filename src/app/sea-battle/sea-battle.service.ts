
import { Injectable } from "@angular/core";
import { last } from "rxjs/operators";

@Injectable({providedIn:"root"}) // TODO provided in sea-battle only ....
export class SeaBattleService
{
  loadLastGame()
  {
    console.log("SeaBattleService.loadLastGame()");
    let lastGame!:SeaBattleGame ;
    const lastGameObj = localStorage.getItem("lastGame");
    if (lastGameObj!=undefined)
    {
      lastGame = JSON.parse(lastGameObj)
    }
    return lastGame;
  }

  saveLastGame(lastGame:SeaBattleGame)
  {
    console.log("SeaBattleService.saveLastGame()");
    localStorage.setItem("lastGame", JSON.stringify(lastGame));
  }

  static getRandomInt(max:number):number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}

export class SeaBattleGame {
  gamename:string = "";  // if not empty then the game is online
  myname:string= "";     // my name, my player
  enemyName:string ="";  // second player's name

  myMap!: SeaMap;
  enemyMap!: SeaMap;

  lastStepOnMyMap!:MapCoordinates;
  lastStepOnEnemyMap!:MapCoordinates;

  isStarted=false;
  isConnected = false;
  isOnline = false;
  isWaiting = false;

  rows:number=10;
  cols:number=10;

  copyGame(lastGame : SeaBattleGame)
  {
    this.gamename=lastGame.gamename;

    this.myname=lastGame.myname;
    this.enemyName=lastGame.enemyName;

    this.isOnline=lastGame.isOnline;
    this.isConnected = lastGame.isConnected;
    this.isWaiting = lastGame.isWaiting;

    this.lastStepOnMyMap = lastGame.lastStepOnMyMap;
    this.lastStepOnEnemyMap = lastGame.lastStepOnEnemyMap;

    this.rows = lastGame.rows;
    this.cols = lastGame.cols;

    this.isStarted=lastGame.isStarted;
    if (this.isStarted== undefined)
    {
      this.isStarted = false;
    }
    this.myMap = new SeaMap(this.rows,this.cols);
    this.myMap.sMap = lastGame.myMap.sMap;
    this.enemyMap = new SeaMap(this.rows,this.cols);
    this.enemyMap.sMap = lastGame.enemyMap.sMap;
  }
}

export class MapItem{
  public value: number;

  constructor(value:number){
    this.value = value;
  }
}

export class MapCoordinates
{
  constructor(public row: number, public col:number, public direction:number=-1)
  {

  }
}

export class SeaMap{

  //TODO public or private?
  public sMap : MapItem [][] = [];

  countOne = 0;
  countTwo = 0;
  countThree = 0;
  countFour = 0;
  countFive = 0;
  countWrong = 0;

  public constructor(private iRows: number, private iCols:number){

    for (let i=0; i < this.iRows; i++)
    {
      let row:MapItem[] = [];

      for (let jx=0; jx < this.iCols; jx++)
      {
        row.push(new MapItem(0));
      }
      this.sMap.push(row);
    }
  }


  public GetMap(){
    var copyMap = [];
    for (var i = 0; i < this.iRows; i++)
      copyMap.push(this.sMap[i].slice());

      return copyMap;
  }

  public reset(){
    for (let i=0; i<this.iRows; i++)
    {
       for (let jx=0; jx<this.iCols; jx++)
       {
        this.sMap[i][jx].value = SeaItemInfo.Empty;
       }
    }
  }

  public RandomMap()
  {
    this.reset();

    if (this.iRows>12)
    {
      this.randomShip(5);
      this.randomShip(4);
      this.randomShip(3);
      this.randomShip(2);
      this.randomShip(1);
    }

    this.randomShip(4);

    this.randomShip(3);
    this.randomShip(3);

    this.randomShip(2);
    this.randomShip(2);
    this.randomShip(2);

    this.randomShip(1);
    this.randomShip(1);
    this.randomShip(1);
    this.randomShip(1);
  }

  getRandomInt(max:number):number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  private randomShip(shipLength: number):void {

    var list:MapCoordinates[] = [];

    var coord = this.findFree(shipLength);
    let iRow = coord.row;
    let iCol = coord.col;
    list.push(coord);
    this.sMap[iRow][iCol].value = SeaItemInfo.Ship;

    let iRowAdd = 0;
    let iColAdd = 0;

    if (coord.direction==0){ // horizontal
      iColAdd = 1;
    } else {
      iRowAdd = 1;
    }

    let isValid :boolean = true;

    for (let i=1; i < shipLength; i++){

      iRow += iRowAdd;
      iCol += iColAdd;

      if (this.hasShip(iRow,iCol)){
        isValid = false;
        break;
      }
      this.sMap[iRow][iCol].value = SeaItemInfo.Ship;
      list.push(new MapCoordinates(iRow, iCol, coord.direction));
    }

    if (isValid){
      isValid = this.validateShipLocation();
    }

    // validate horizontal-vertical connection for the new ship
    iRow += iRowAdd;
    iCol += iColAdd;
    if (this.hasShip(iRow,iCol)){
      isValid = false;
    }

    if (!isValid){
      for (let i=0; i<list.length; i++){
        iRow = list[i].row;
        iCol = list[i].col;
        this.sMap[iRow][iCol].value=SeaItemInfo.Empty;
      }

      this.randomShip(shipLength);
      return;
    }

    return;
  }

  findFree(iShipLength:number) : MapCoordinates
  {
    let iDirection = this.getRandomInt(2); // 0 - horizontal, 1 - vertical

    let maxCount = this.iRows;
    if (this.iCols>maxCount) maxCount = this.iCols;

    let iStartA = this.getRandomInt(maxCount-(iShipLength-1));
    let iStartB = this.getRandomInt(maxCount);

    let iRow = 0;
    let iCol = 0;

    if (iDirection==0){ // horizontal
      iRow = iStartB;
      iCol = iStartA;
    } else {
      iRow = iStartA;
      iCol = iStartB;
    }

    if (this.sMap[iRow][iCol].value==SeaItemInfo.Empty &&
        !this.hasShip(iRow-1, iCol) &&
        !this.hasShip(iRow+1, iCol) &&
        !this.hasShip(iRow, iCol-1) &&
        !this.hasShip(iRow, iCol+1)
        )
    {
      return new MapCoordinates(iRow,iCol,iDirection);
    }

    return this.findFree(iShipLength);
  }

  public validateMap()
  {
    this.resetShipCount();

    if (this.sMap == undefined) return false;

    if (this.iRows < 1) return false;
    if (this.iCols < 1) return false;

    if (!this.validateShipLocation())
    {
      return false;
    }

    if (!this.validateShipCount())
    {
      return false;
    }

    return true;

  }

  public validateShipLocation()
  {
    // check schräge-Verbindung
    for (let i=0; i<this.iRows; i++)
    {
      for (let jx=0; jx<this.iCols; jx++)
      {
        if (this.hasShip(i,jx)) // TODO replace by .hasShip
        {
          if (this.hasDiagonalConnections(i,jx))
          {
            console.log("Invalid Map. Diagonal connections are available");
            return false;
          }
        }
      }
    }

    return true;
  }

  public validateShipCount()
  {
    // check/count 1-cell item
    for (let i=0; i<this.iRows; i++)
    {
      for (let jx=0; jx<this.iCols; jx++)
      {
        if (this.hasShip(i,jx))
        {
          if (!this.hasNonDiagonalConnections(i,jx))
          {
            this.countOne++;
          }
        }
      }
    }

    let countOneCell = 4;
    if (this.iRows>12) countOneCell++;
    if (!this.checkCount(this.countOne, countOneCell, "OneCell-Ships"))
    {
      return false;
    }


    // check/count horizontal items
    for (let i=0; i<this.iRows; i++)
    {
      var shipLength = 0;
      for (let jx=0; jx<this.iCols; jx++)
      {
        if (this.hasShip(i,jx))
        {
          shipLength++;
        }
        else
        {
          this.addShipCount(shipLength);
          shipLength=0;
        }
      }
      this.addShipCount(shipLength);
    }

    // check/count vertical items
    for (let jx=0; jx<this.iCols; jx++)
    {
      var shipLength = 0;
      for (let i=0; i<this.iRows; i++)
      {
        if (this.hasShip(i,jx))
        {
          shipLength++;
        }
        else
        {
          this.addShipCount(shipLength);
          shipLength=0;
        }
      }
      this.addShipCount(shipLength);
    }

    let inc = 0;
    if (this.iRows>12) inc=1;

    if (
      this.checkCount(this.countTwo,   3 + inc, "TwoCell-Ships") &&
      this.checkCount(this.countThree, 2 + inc, "ThreeCell-Ships") &&
      this.checkCount(this.countFour,  1 + inc, "FourCell-Ships") &&
      this.checkCount(this.countFive,  0 + inc, "FourCell-Ships") &&
      this.checkCount(this.countWrong, 0, "Wrong-Ships")
    )
    {
      return true;
    }

    return false;
  }

  checkCount(iCount: number, iCountExpected: number, info:string) :boolean
  {
    if (info==undefined){ info = "Wrong-Ships"}

    if (iCount!=iCountExpected)
    {
      console.log("Invalid Map. "+  info + " : " +  iCountExpected.toString() + " items(s) expected, but found " + iCount.toString());
      return false;
    }

    return true;
  }

  resetShipCount()
  {
    this.countOne = 0;
    this.countTwo = 0;
    this.countThree = 0;
    this.countFour = 0;
    this.countFive = 0;
    this.countWrong = 0;
  }

  addShipCount(shipLength:number)
  {
    if (shipLength<2) {return;}

    if (shipLength==2) {
      this.countTwo++;
    }

    if (shipLength==3) {
      this.countThree++;
    }

    if (shipLength==4) {
      this.countFour++;
    }

    if (shipLength==5) {
      this.countFive++;
    }

    if (shipLength>5) {
      this.countWrong ++;
    }
  }

  private hasDiagonalConnections(irow: number, icol:number){
    if (this.hasShip(irow-1, icol-1) ||
        this.hasShip(irow-1, icol+1) ||
        this.hasShip(irow+1, icol-1) ||
        this.hasShip(irow+1, icol+1)
    ) {
      return true;
    }

    return false;
  }

  private hasNonDiagonalConnections(irow: number, icol:number){
    if (this.hasShip(irow, icol-1) ||
        this.hasShip(irow, icol+1) ||
        this.hasShip(irow-1, icol) ||
        this.hasShip(irow+1, icol)
        ) return true;

    return false;
  }

  private hasRightConnections(irow: number, icol:number)
  {
    return this.hasShip(irow,icol+1);
  }

  private hasLeftConnections(irow: number, icol:number)
  {
    return this.hasShip(irow,icol-1);
  }

  private hasBottomConnections(irow: number, icol:number)
  {
    return this.hasShip(irow+1,icol);
  }

  private hasTopConnections(irow: number, icol:number){
    return this.hasShip(irow-1,icol);
  }

  private hasShip(irow: number, icol:number){

    if (
      icol >= 0 &&
      icol < this.iCols &&
      irow >= 0 &&
      irow < this.iRows &&
      (
        this.sMap[irow][icol].value==SeaItemInfo.Ship ||
        this.sMap[irow][icol].value==SeaItemInfo.ShipHitted ||
        this.sMap[irow][icol].value==SeaItemInfo.ShipDead
      ))
    {
      return true;
    }

    return false;
  }

  private isHitted(irow: number, icol:number){

    if (
      icol >= 0 &&
      icol < this.iCols &&
      irow >= 0 &&
      irow < this.iRows &&
      (
        this.sMap[irow][icol].value==SeaItemInfo.ShipHitted ||
        this.sMap[irow][icol].value==SeaItemInfo.ShipDead
      ))
    {
      return true;
    }

    return false;
  }

  public isDead(row: number, col:number): boolean
  {
    if (!this.hasShip(row,col))
    {
      return false;
    }

    const list = this.getShip(row, col);

    const notHitted = list.find(x=>!this.isHitted(x.row,x.col))

    return notHitted ==undefined
  }

  // set 'value' for each cell of the ship
  public markShip(row:number, col:number, value:number)
  {
    const list = this.getShip(row, col);
    if (list==undefined)
    {
      return;
    }
    list.forEach(x=> this.sMap[x.row][x.col].value = value);
  }

  public markShipDead(row:number, col:number)
  {
    const list = this.getShip(row, col);

    list.forEach(x=> this.sMap[x.row][x.col].value = SeaItemInfo.ShipDead);

    list.forEach(x=> this.markShipCellArea(x.row, x.col));
  }

  private markShipCellArea(row: number, col:number){

    this.markCell(row-1, col-1);
    this.markCell(row-1, col);
    this.markCell(row-1, col+1);

    this.markCell(row, col-1);
    this.markCell(row, col+1);

    this.markCell(row+1, col-1);
    this.markCell(row+1, col);
    this.markCell(row+1, col+1);
  }

  private markCell(row: number, col:number){
    if (
      col >= 0 &&
      col < this.iCols &&
      row >= 0 &&
      row < this.iRows &&
      this.sMap[row][col].value == SeaItemInfo.Empty
    )
    {
      this.sMap[row][col].value=SeaItemInfo.EmptyMarked;
    }
  }


  private getShip(row:number, col:number) : MapCoordinates[]
  {
    let list: MapCoordinates[] = [];

    if (!this.hasShip(row, col)) return list;

    let iRowAdd = 0;
    let iColAdd = 0;

    // find direction
    if (this.hasTopConnections(row, col) || this.hasBottomConnections(row, col))
    {
      iRowAdd = -1;
    }

    if (this.hasLeftConnections(row, col) || this.hasRightConnections(row, col))
    {
      iColAdd = -1;
    }

    if (iRowAdd==0 && iColAdd==0)
    {
      list.push(new MapCoordinates(row,col));
      return list; // one-cell ship
    }

    let i = row;
    let j= col;

    // ship has horizontal location
    if (iColAdd!=0)
    {
      while (this.hasShip(i,j-1))
      {
        j--;
      }

      // so j contains starting-column of the ship
      while (this.hasShip(i,j))
      {
        list.push(new MapCoordinates(i,j));
        j++;
      }
      return list;
    }

    // ship has vertical location
    if (iRowAdd!=0)
    {
      while (this.hasShip(i-1,j))
      {
        i--;
      }

      // so j contains starting-row of the ship
      while (this.hasShip(i,j))
      {
        list.push(new MapCoordinates(i,j));
        i++;
      }
      return list;
    }

    return list; // actually undefined ... 
  }
}

export enum SeaItemInfo {
  Empty = 0,
  EmptyHitted = 1,
  EmptyMarked = 2,
  Ship = 10,
  ShipHitted = 11,
  ShipDead = 12,

  WaitingForSecondPlayerConnected = -1,
  ArmyShallFire = -2,
  Fire = -3,

}



