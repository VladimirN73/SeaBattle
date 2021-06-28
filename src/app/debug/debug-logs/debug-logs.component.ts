import { Component, OnInit } from '@angular/core';
import { DebugService } from '../debug.service';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['../debug-styles.scss']
})
export class DebugLogsComponent implements OnInit {
  logs: string[] = [];

  constructor(private debugService: DebugService) { }

  ngOnInit(): void {
    this.logs = this.debugService.getLogs();
  }

  onClear(){
    this.debugService.clearLogs();
    this.logs = [];
  }
}
