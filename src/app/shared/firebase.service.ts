import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn:"root"})
export class FirebaseService {

  myapi="https://lina-game-default-rtdb.europe-west1.firebasedatabase.app/";

  error = new Subject<string>();

  constructor(private http:HttpClient){ }

  getNextStep(gamename:string){
    return this.http
    .get<SeaStep>(this.myapi + gamename + '.json');
  }

  setNextStep(gamename:string, step: SeaStep){

    this.http
      .put(this.myapi + gamename + '.json', step)
      .subscribe(
        val => { console.log(val); },
        err => { this.error.next(err.message);
      });
  }
}

export class SeaStep{
  info: number = 0; // see enum SeaStepInfo
  row: number = 0;
  col:number = 0;
  player: string = "";
}
