import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { throwError } from "rxjs";
import { map, mapTo } from "rxjs/operators";
import { DebugService } from "../debug/debug.service";

@Injectable({providedIn:"root"})
export class FirestoreService {

    constructor(private db: AngularFirestore, private debug:DebugService) { 

    }

    createGame(name:string)
    {
        // let newGame = JSON.parse('{fieldA:"value a",fieldB:"value b", }') as Game;

        // this.db.collection("dsd").add(newGame);

        let ret = this.db.collection("games").add({
            first: "Ada",
            last: "Lovelace",
            born: 1815
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            return docRef;
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            return throwError(error);
        });

        return ret;
    }

    setGame(name:string)
    {
        const dateNow =  (new Date()).toTimeString();

        let ret = this.db.doc(`games/${name}`).set({
            myDate: dateNow,
            myText: "a text",
        })
        .then(() => {
            console.log("Document is set ");
            return;
        })
        .catch((error) => {
            console.error("Error setting document: ", error);
            return throwError(error);
        });

        return ret;
    }

    getNextStep(gamename:string)
    {
      this.log(`getNextStep, gameName:${gamename}`);

      let ret = this.db.doc(`games/${gamename}`).valueChanges(); //.pipe(map(x => convertToSeaStep(x)));

      return ret; 
    }

    setNextStep(gamename:string, seaStep:SeaStep)
    {
        this.log(`setNextStep, gameName:${gamename}, seaStep:`, seaStep);

        const dateNow =  (new Date()).toTimeString();

        let ret = this.db.doc(`games/${gamename}`)
        .set({...seaStep})
        .then(() => {
            console.log("Document is set ");
            return;
        })
        .catch((error) => {
            console.error("Error setting document: ", error);
            return throwError(error);
        });

        return ret;
    }

    log(str:string, message?:any)
    {
        this.debug.log("firestore.service." + str, message);
    }


}

export interface Game {
    fieldA:string;
    fieldB:string;
}

export class SeaStep{
    info: number = 0; // see enum SeaStepInfo
    row: number = 0;
    col:number = 0;
    player: string = "";
}

export function convertToSeaStep(doc: any)  {

    let ret = <SeaStep> doc.map((snap: { data: () => SeaStep; }) => {
        return {
            ...<any>snap.data()
        }
    });

    return ret;
}

