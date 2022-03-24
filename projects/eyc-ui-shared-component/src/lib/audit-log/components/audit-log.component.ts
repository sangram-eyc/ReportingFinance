import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'lib-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit, OnDestroy {

  // appContainer;
  @Input() show: boolean;
  @Input() fileDetail;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() stage;
  updatedText = "approved on"
  step: number = 6;

  @Input() auditLogs = [];
  constructor(public datepipe: DatePipe, private eRef: ElementRef) {
    // this.appContainer = document.getElementById('main-container');
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
    // this.appContainer.style.paddingRight = '0';
  }

  viewAuditLog() {
if (this.show) {
      this.openAuditLog();
    } else {
      this.closeAuditLog();
    }
  }

  openAuditLog() {
    // this.appContainer.style.paddingRight = '33%';
    // console.log(this.appContainer);
    this.show = true;
    this.showChange.emit(this.show);
  }

  closeAuditLog() {
    // this.appContainer.style.paddingRight = '0';
    this.show = false;
    this.showChange.emit(this.show);
  }

  getStatus(progress) {
    let state = 'not-set';

    if (progress === 'In Progress' || progress === 'in-progress' || progress === 'IN_PROGRESS'|| progress === 'Started') {
      state = "in-progress";
    } else if ((progress === 'Completed' || progress === 'completed' || progress === 'COMPLETED' || progress === 'Approve')) {
      state = 'completed';
    } else if(progress === 'ERROR' || progress === 'Unapprove') {
      return 'error'
    } else {
      state = 'not-set';
    }
    return state;
  }

  getError(progress) {
    if (progress == "ERROR" || progress === 'Unapprove') {
      return true;
    } else {
      return false;
    }
  }

  getSubtitle(auditActionType, modifieruserName, modifiedDateTime, index, progress, item) {
    let status = this.getStatus(auditActionType)

    if (status == 'in-progress') {
      return 'In progress';
    } else if (status == 'not-set') {
      return '';
    } else {
      if(item.hasOwnProperty('subTitle')){
        return item.subTitle
      } else {
        if (status == 'error') {
          return modifieruserName + ' ' + "unapproved on" + ' ' + this.datepipe.transform(modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
        } else {
          if (this.stage == 'Submission') {
            return modifieruserName + ' ' + 'on' + ' ' + this.datepipe.transform(modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
          } else {
            return modifieruserName + ' ' + this.updatedText + ' ' + this.datepipe.transform(modifiedDateTime, 'MMM dd y hh:mm a', '+0000') + ' GMT';
          }
        }
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      //Clicked inside
    } else {
      //Clicked ouside
      this.show = false;
      this.showChange.emit(this.show);
    }
  }
}
