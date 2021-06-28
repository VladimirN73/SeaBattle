import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeaBattleGame, SeaBattleService } from './sea-battle.service';

@Component({
  selector: 'app-sea-battle',
  templateUrl: './sea-battle.component.html',
  styleUrls: ['./sea-battle.component.scss']
})
export class SeaBattleComponent implements OnInit, OnDestroy {

  lastGame!:SeaBattleGame;
  isLastGameAvailable=false;

  gameName="";
  myname=""

  message:string = "";

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private seaBattleService: SeaBattleService) {

    }

  ngOnInit(): void {
    this.lastGame = this.seaBattleService.loadLastGame();
    this.isLastGameAvailable = false;

    if (this.lastGame!=undefined)
    {
      this.isLastGameAvailable = true;
      this.gameName=this.lastGame.gamename;
      this.myname=this.lastGame.myname;
    }


  }

  onNewOfflineGame(gamename:string, myname:string){
    let game = new SeaBattleGame();
    game.isOnline = false;
    game.gamename = gamename;
    game.myname = myname;
    this.seaBattleService.saveLastGame(game);
    this.router.navigate(['play'], {relativeTo:this.route});
  }

  onNewOnlineGame(gamename:string, myname:string, rows: number, cols:number)
  {
    if (gamename ==undefined || gamename=="")
    {
      this.message = "Game Name is missing";
      return;
    }

    if (myname ==undefined || myname=="")
    {
      this.message = "My Name is missing";
      return;
    }

    let game = new SeaBattleGame();
    game.gamename = gamename;
    game.myname = myname;
    game.isOnline = true;
    game.isConnected = false;

    game.rows = rows;
    game.cols = cols;

    this.seaBattleService.saveLastGame(game);
    this.router.navigate(['play'], {relativeTo:this.route});
  }

  ngOnDestroy(): void
  {
    console.log("SeaBattleComponent.ngOnDestroy()");
  }



}

