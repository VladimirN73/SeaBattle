
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({providedIn:"root"})
export class DebugService{

    private logs:string[] = [];
    deferredInstallPrompt: any = null;
    private lineSeparator = ";";

    isInstalled = new Subject<true>();

    constructor(
        private datePipe: DatePipe){
    }

    public setInstallPrompt(deferredInstallPrompt:any){
      this.deferredInstallPrompt = deferredInstallPrompt;
    }

    public log(str: string, message?: string | any){
        this.logs = this.getLogs();
        if (this.logs.length > 200){
            this.logs = this.logs.slice(0,100);
        }

        if (typeof message === 'string' || message instanceof String){
          // nothig to do
        } else {
          message = JSON.stringify(message)
        }

        message = str + message;

        const time =  this.datePipe.transform(new Date(), 'HH:mm:ss');

        // add log on top
        this.logs.unshift(time  + ' ' + message);

        localStorage.setItem('logs', this.logs.join(this.lineSeparator));

        console.log(message);
    }

    public getLogs() : string[]{
        const str = localStorage.getItem('logs');
        if (!str){
            return [];
        }
        const ret = str.split(this.lineSeparator);

        return ret;
    }

    public clearLogs() {
        localStorage.setItem('logs',"");
        this.logs = [];
    }

    public setInstalled()
    {
        this.isInstalled.next(true);
    }
}
