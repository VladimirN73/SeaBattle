import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment'
import { DebugService } from './debug.service'

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug-styles.scss']
})
export class DebugComponent implements OnInit {

  version = environment.version;
  isInstalling = false;

  constructor(private debugService: DebugService) { }

  ngOnInit(): void {
  }


  onInstall() {
    this.debugService.log('-> onInstall');
    this.isInstalling = true;
    const installPrompt = this.debugService.deferredInstallPrompt;

    if (!installPrompt) {
      this.debugService.log('onInstall: prompt is null, so return');
      this.debugService.setInstalled();
      this.isInstalling = false;
      return;
    }

    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult:any) => {

      if (choiceResult.outcome !== 'accepted') {
          this.debugService.log('onInstall: install prompt is not accepted');
          this.debugService.setInstalled();
          this.isInstalling = false;
          return;
      }

      this.debugService.log('onInstall: install prompt is accepted');
      this.debugService.deferredInstallPrompt = null;
      this.isInstalling = false;
    });
  }

}
