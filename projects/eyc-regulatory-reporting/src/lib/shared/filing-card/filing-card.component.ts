import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { PermissionService } from 'eyc-ui-shared-component';
import { count } from 'rxjs/operators';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-filing-card',
  templateUrl: './filing-card.component.html',
  styleUrls: ['./filing-card.component.scss']
})
export class FilingCardComponent implements OnInit {

  private _filingData;
  innerWidth: any;
  filingWidth = 15;
  periodWidth = 10;
  
  @Input()
  set filingData(filingData: object) {
    this._filingData = filingData;
    this.dueDate = this._filingData.dueDate;
    // this.formatDate();
    this.startDate = this._filingData.startDate;
    this.comments = this._filingData.comments;
    this.name = this._filingData.name;
    this.states = this._filingData.status;
    this.period = this._filingData.period;
    this.totalFunds = this._filingData.totalFunds;
    this.setStatus();
  };
  startDate = '';
  dueDate = '';
  comments = [];
  name = '';
  period = '';
  status = {
    stage: '',
    progress: '',
    stageCode: ''
  };
  states: any[] = [];
  totalFunds;
  // states = [
  //   {
  //     stage: 'Fund Scoping',
  //     progress: 'not-set',
  //     displayOrder: 1
  //   },
  //   {
  //     stage: 'Data Intake',
  //     progress: 'not-set',
  //     displayOrder: 1
  //   },
  //   {
  //     stage: 'Reporting',
  //     progress: 'not-set',
  //     displayOrder: 1
  //   },
  //   {
  //     stage: 'Client Review',
  //     progress: 'not-set',
  //     displayOrder: 1
  //   },
  //   {
  //     stage: 'Submission',
  //     progress: 'not-set',
  //     displayOrder: 1
  //   }
  // ];
  statusMessage = ''


  constructor(
    private router: Router,
    private filingService: RegulatoryReportingFilingService,
    public permissions: PermissionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(window.innerWidth);
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.filingWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.filingWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      this.filingWidth = 30;
      this.periodWidth = 20
    }else {
      this.filingWidth = 15;
      this.periodWidth = 10
    }
  }

  formatDate() {
    let due = new Date(this.dueDate);
    // console.log(due);
    // console.log(this.dueDate);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
      + ('0' + due.getDate()).slice(-2) + '/'
      + due.getFullYear();
    this.dueDate = newdate;
  }

  setStatus() {
    // let currentStatusFound = false;
    this.states.sort(this.sortStates);
    this.states.forEach(state => {

      if (state.progress === 'In Progress' || state.progress === 'in-progress') {
        state['progress'] = "in-progress";
        // currentStatusFound = true; 
        if (this.status.stage === '') {
          this.statusMessage = 'Ready for ' + state.stage.toLowerCase();
          this.status = state;
        }
      } else if ((state.progress === 'Completed' || state.progress === 'completed')) {
        state['progress'] = 'completed';
      } else {
        state['progress'] = 'not-set'
      }
    });
  }

  getStatus(index: number): string | null {
    index = index - 1;
    return this.states[index]['progress'];
  }


  preapreStage(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING": return 'Fund Scoping';
      case "DATA_INTAKE":  return 'Data Intake';
      case "REPORTING":  return 'Reporting';
      case "CLIENT_REVIEW": return 'Client Review';
      case "SUBMISSION": return 'Submission';
    }
  }
  preapreViewFeature(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING": return 'View Fund Scoping';
      case "DATA_INTAKE":  return 'View Data Intake';
      case "REPORTING":  return 'View Reporting';
      case "CLIENT_REVIEW": return 'View Client Review';
      case "SUBMISSION": return 'View Submission';
    }
  }

  preapreRouting(stageCode) {
    switch (stageCode) {
      case "FUND_SCOPING":
        this.router.navigate(['/fund-scoping']);
        break;
      case "DATA_INTAKE":
          this.router.navigate(['/data-intake']);
          break;
      case "REPORTING":
        this.router.navigate(['/regulatory-reporting']);
        break;
      case "CLIENT_REVIEW":
        this.router.navigate(['/client-review']);
        break;
      case "SUBMISSION":
        this.router.navigate(['/submission']);
    }
  }

  routeToDetailsView() {
    // this.router.navigate(['/regulatory-filing-list/'+1]);
    this.filingService.setfilingData = this._filingData;
    switch (this.status.stageCode) {
      case "FUND_SCOPING":
        if(this.permissions.validatePermission('Fund Scoping', 'View Fund Scoping')) {
          this.router.navigate(['/fund-scoping']);
        } else {
            const dataIntakeIndex = this._filingData.status.findIndex(item => item.stageCode === this.status.stageCode);
            for(let i=dataIntakeIndex; i < this._filingData.status.length; i++) {
               if(this.permissions.validatePermission(this.preapreStage(this._filingData.status[i].stageCode), this.preapreViewFeature(this._filingData.status[i].stageCode))) {
                this.preapreRouting(this._filingData.status[i].stageCode);
                return;
              }
              if ((i+1) ===this._filingData.status.length) {
                 this.errorModalPopup();
               }
            }
        }
        break;
      case "DATA_INTAKE":
        if(this.permissions.validatePermission('Data Intake', 'View Data Intake')) {
          this.router.navigate(['/data-intake']);
        } else {
            const dataIntakeIndex = this._filingData.status.findIndex(item => item.stageCode === this.status.stageCode);
            for(let i=dataIntakeIndex; i < this._filingData.status.length; i++) {
               if(this.permissions.validatePermission(this.preapreStage(this._filingData.status[i].stageCode), this.preapreViewFeature(this._filingData.status[i].stageCode))) {
                this.preapreRouting(this._filingData.status[i].stageCode);
                return;
               } 
               if ((i+1) ===this._filingData.status.length) {
                this.errorModalPopup();
              } 
            }
        }
        break;
      case "REPORTING":
        if(this.permissions.validatePermission('Reporting', 'View Reporting')) {
          this.router.navigate(['/regulatory-reporting']);
        } else {
            const dataIntakeIndex = this._filingData.status.findIndex(item => item.stageCode === this.status.stageCode);
            for(let i=dataIntakeIndex; i < this._filingData.status.length; i++) {
              console.log(dataIntakeIndex);
              
               if(this.permissions.validatePermission(this.preapreStage(this._filingData.status[i].stageCode), this.preapreViewFeature(this._filingData.status[i].stageCode))) {
                this.preapreRouting(this._filingData.status[i].stageCode);
                return;
               }
               if ((i+1) ===this._filingData.status.length) {
                this.errorModalPopup();
              }  
            }
        }
        break;
      case "CLIENT_REVIEW":
        if(this.permissions.validatePermission('Client Review', 'View Client Review')) {
          this.router.navigate(['/client-review']);
        } else {
            const dataIntakeIndex = this._filingData.status.findIndex(item => item.stageCode === this.status.stageCode);
            for(let i=dataIntakeIndex; i < this._filingData.status.length; i++) {
              console.log(dataIntakeIndex);
              
               if(this.permissions.validatePermission(this.preapreStage(this._filingData.status[i].stageCode), this.preapreViewFeature(this._filingData.status[i].stageCode))) {
                this.preapreRouting(this._filingData.status[i].stageCode);
                return;
               } 
               if ((i+1) ===this._filingData.status.length) {
                this.errorModalPopup();
              } 
            }
        }
        break;
      case "SUBMISSION":
        if(this.permissions.validatePermission('Submission', 'View Submission')) {
          this.router.navigate(['/submission']);
        } else {
            for(let i=0; i < this._filingData.status.length; i++) {
               if(this.permissions.validatePermission(this.preapreStage(this._filingData.status[i].stageCode), this.preapreViewFeature(this._filingData.status[i].stageCode))) {
                this.preapreRouting(this._filingData.status[i].stageCode);
                return;
               } 
               if ((i+1) ===this._filingData.status.length) {
                this.errorModalPopup();
              } 
            }
        }
    }

  }

  sortStates(a, b) {
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

  errorModalPopup() {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: "Access Denied",
        description: "You do not have access to view the filing. Please contact an administrator.",
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth);
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.filingWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.filingWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      // console.log("inside 1600");
      this.filingWidth = 30;
      this.periodWidth = 20
    }else {
      this.filingWidth = 15;
      this.periodWidth = 10
    }
  }
}
