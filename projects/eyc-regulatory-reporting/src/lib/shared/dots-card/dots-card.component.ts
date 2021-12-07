import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { PermissionService } from 'eyc-ui-shared-component';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';

@Component({
  selector: 'lib-dots-card',
  templateUrl: './dots-card.component.html',
  styleUrls: ['./dots-card.component.scss']
})
export class DotsCardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() status: Object = {
    stage: 'Submission',
    progress: 'in-progress'
  };

  @Output() filingDetails = new EventEmitter<any>();
  @Output() fileStatus = new EventEmitter<any>();
  @Output() filingStatusRes = new EventEmitter<any>();
  ngUnsubscribe = new Subject()
  dueDate: string;
  filingName: string;
  period: string;
  filingId: number;
  states = [];

  constructor(
    public router: Router,
    private filingService: RegulatoryReportingFilingService,
    private permissions: PermissionService,
    private eycRRSettingSvc:EycRrSettingsService
  ) { }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.dueDate = this.filingService.getFilingData.dueDate;
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      this.filingDetails.emit(this.filingService.getFilingData);
      this.getFilingStatus();
      this.filingService.dotcardStatusDetails.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
        this.getFilingStatus();
      });
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  formatDate() {
    let due = new Date(this.dueDate);
    const newdate= ('0' + (due.getMonth() + 1)).slice(-2) + '/'
    + ('0' + due.getDate()).slice(-2) + '/'
    + due.getFullYear();
    this.dueDate = newdate;
  }

  ngOnChanges(changes: SimpleChanges) { 
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setStatus() {
    this.states.sort(this.progressSort);
    this.states.forEach(state => {
      if (state.progress === 'In Progress' || state.progress === 'in-progress' || state.progress === 'IN_PROGRESS') {
        state.progress = "in-progress";
        state.disabled = false;
      } else if ((state.progress === 'Completed' || state.progress === 'completed' || state.progress === 'COMPLETED')) {
        state.progress = 'completed';
        state.disabled = false;
      } else {
        state.progress = 'not-set';
        state.disabled = true;
      }
    });
  }

  getFilingStatus() {
    this.filingService.getFilingStatus(this.filingId).subscribe(res => {
      this.states = res['data'];
      this.filingStatusRes.emit(res['data']);
      this.states.forEach(item => {
        switch (item['stageCode']) {
          case "FUND_SCOPING":
            item.customCls = 'cust-fund';
            item.url = '/fund-scoping';
            item.disabled = true;
            break;
          case "DATA_INTAKE":
            item.customCls = 'cust-intake';
            item.url = '/data-intake';
            item.disabled = true;
            break;
          case "REPORTING":
            item.customCls = 'cust-report';
            item.url = '/regulatory-reporting';
            item.disabled = true;
            break;
          case "CLIENT_REVIEW":
            item.customCls = 'cust-review';
            item.url = '/client-review';
            item.disabled = true;
            break;
          case "SUBMISSION":
            item.customCls = 'last-item-class';
            item.url = '/submission';
            item.disabled = true;
        }
      });
      this.setStatus();
      this.eycRRSettingSvc.setStatusGlobal(this.states);

      let cmpSt = res['data'].find(item => item.progress !== 'completed');
      if (cmpSt) {
          if (cmpSt.stageCode !== 'SUBMISSION') {
            this.fileStatus.emit("in-progress");
          } else { this.fileStatus.emit("completed"); }
      } else {
          this.fileStatus.emit("all-completed");
      }
    });
  }

  updateSubmissionStatus() {
    this.states = [
      {
          "stageId": 21,
          "stage": "Scoping",
          "stageCode": "FUND_SCOPING",
          "progress": "COMPLETED",
          "displayOrder": 1
      },
      {
          "stageId": 22,
          "stage": "Intake",
          "stageCode": "DATA_INTAKE",
          "progress": "COMPLETED",
          "displayOrder": 2
      },
      {
          "stageId": 23,
          "stage": "Reporting",
          "stageCode": "REPORTING",
          "progress": "COMPLETED",
          "displayOrder": 3
      },
      {
          "stageId": 24,
          "stage": "Client review",
          "stageCode": "CLIENT_REVIEW",
          "progress": "COMPLETED",
          "displayOrder": 4
      },
      {
          "stageId": 25,
          "stage": "Submission",
          "stageCode": "SUBMISSION",
          "progress": "COMPLETED",
          "displayOrder": 5
      }
  ];

    this.states.forEach(item => {
        switch (item['stageCode']) {
          case "FUND_SCOPING":
            item.customCls = 'cust-fund';
            item.url = '/fund-scoping';
            item.disabled = true;
            break;
          case "DATA_INTAKE":
            item.customCls = 'cust-intake';
            item.url = '/data-intake';
            item.disabled = true;
            break;
          case "REPORTING":
            item.customCls = 'cust-report';
            item.url = '/regulatory-reporting';
            item.disabled = true;
            break;
          case "CLIENT_REVIEW":
            item.customCls = 'cust-review';
            item.url = '/client-review';
            item.disabled = true;
            break;
          case "SUBMISSION":
            item.customCls = 'last-item-class';
            item.url = '/submission';
            item.disabled = true;
        }
      });
      this.setStatus();
      this.eycRRSettingSvc.setStatusGlobal(this.states);
  }

  progressSort(a, b) {
    let stage1 = a.displayOrder;
    let stage2 = b.displayOrder;

    if (stage1 > stage2) {
      return 1;
    } else if (stage1 < stage2) {
      return -1;
    } else {
      return 0;
    }
  }

  getStatus(index: number): string | null {
    return this.states[index].progress;
  }

  disState(index: number): boolean | null {
    if (index == 0) {
      if (!this.permissions.validatePermission('Fund Scoping', 'View Fund Scoping') || this.states[index].disabled) {
        return true;
      }
    } else if (index == 1) {
      if (!this.permissions.validatePermission('Data Intake', 'View Data Intake') || this.states[index].disabled) {
        return true;
      }
    } else if (index == 2) {
      if (!this.permissions.validatePermission('Reporting', 'View Reporting') || this.states[index].disabled) {
        return true;
      }
    } else if (index == 3) {
      if (!this.permissions.validatePermission('Client Review', 'View Client Review') || this.states[index].disabled) {
        return true;
      }
    } else if (index == 4) {
      if (!this.permissions.validatePermission('Submission', 'View Submission') || this.states[index].disabled) {
        return true;
      }
    } else {
      return this.states[index].disabled;
    }
  }

  handleStepClick(pageUrl, enableRoute) { // For clickable steps
    if (!enableRoute) { this.router.navigate([pageUrl]); }
  }

}
