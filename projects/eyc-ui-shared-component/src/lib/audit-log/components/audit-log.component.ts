import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, OnDestroy {

  appContainer;
  @Input() show: boolean;
  @Input() fileDetail;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  step: number = 6;

  @Input() auditLogs = [];
  constructor() {
    this.appContainer = document.getElementById('main-container');
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.show) {
      this.viewAuditLog();
    }
  }
  
  ngOnDestroy(): void {
    this.appContainer.style.paddingRight = '0';
  }

  viewAuditLog() {
if (this.show) {
      this.openAuditLog();
    } else {
      this.closeAuditLog();
    }
  }

  openAuditLog() {
    this.appContainer.style.paddingRight = '33%';
    console.log(this.appContainer);
    this.show = true;
    this.showChange.emit(this.show);
  }

  closeAuditLog() {
    this.appContainer.style.paddingRight = '0';
    this.show = false;
    this.showChange.emit(this.show);
  }

  getStatus(progress) {
    let state = 'not-set';

    if (progress === 'In Progress' || progress === 'in-progress' || progress === 'IN_PROGRESS') {
      state = "in-progress";
    } else if ((progress === 'Completed' || progress === 'completed' || progress === 'COMPLETED')) {
      state = 'completed';
    } else if(progress === 'ERROR') {
      return 'error'
    } else {
      state = 'not-set';
    }
    return state;
  }

  getError(progress) {
    if (progress == "ERROR") {
      return true;
    } else {
      return false;
    }
  }
}
