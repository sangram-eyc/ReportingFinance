import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TaxReportingFilingService } from '../../tax-reporting/services/tax-reporting-filing.service';

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
    this.formatDate();
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
    private filingService: TaxReportingFilingService
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

  routeToDetailsView() {
    // this.router.navigate(['/regulatory-filing-list/'+1]);
    this.filingService.setfilingData = this._filingData;
    switch (this.status.stageCode) {
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.filingWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.filingWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      console.log("inside 1600");
      this.filingWidth = 30;
      this.periodWidth = 20
    }else {
      this.filingWidth = 15;
      this.periodWidth = 10
    }
  }
}
