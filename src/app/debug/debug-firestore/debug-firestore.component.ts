import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService, Game, SeaStep } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-debig-firestore',
  templateUrl: './debug-firestore.component.html',
  styleUrls: ['../debug-styles.scss']
})
export class DebugFirestoreComponent implements OnInit {

  str = "";

  constructor(private db: AngularFirestore, private fire: FirestoreService) { }

  
  ngOnInit(): void {
  }

  onLoad()
  {
    let doc = this.db.doc("/debug/game1").get().subscribe(
      snapshot =>
      {
         this.log(snapshot.id);
         this.log(snapshot.data());

         this.str = snapshot.id;
      }
    )
  }

  onLoadExt()
  {
    let doc = this.db.doc("/debug/game1").snapshotChanges().subscribe(
      snapshot =>
      {
         console.log("onLoadExt, data", snapshot.payload.data());

         let temp = snapshot.payload.data() as Game;

         console.log("onLoadExt, game", temp);
         //this.str = snapshot.payload.d
      }
    )
  }

  onCreate()
  {
    this.fire.createGame("test")
    .then(x => {
      console.log("onCreate ", x );
    })
    .catch(err => {
      console.log("onCreate ", err );
    });
  }

  onSet()
  {
    this.fire.setGame("game1")
    .then(x => {
      console.log("onCreate ", x );
    })
    .catch(err => {
      console.log("onCreate ", err );
    });
  }

  onGetStep()
  {
    this.fire.getNextStep("gameA").subscribe(
      val => console.log("onGetStep", val)
    );
  }

  onSetStep()
  {
    let step = new SeaStep();
    step.player = "bitA";
    this.fire.setNextStep("gameA", step);    
  }


  private log(obj: any)
  {
    console.log(obj);
  }

}

export function convertSnaps<T>(results: { docs: any[]; })  {
  return <T[]> results.docs.map(snap => {
      return {
          id: snap.id,
          ...<any>snap.data()
      }
  })
}
