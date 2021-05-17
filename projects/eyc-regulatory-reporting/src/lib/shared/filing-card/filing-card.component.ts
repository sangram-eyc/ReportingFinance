import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filing-card',
  templateUrl: './filing-card.component.html',
  styleUrls: ['./filing-card.component.scss']
})
export class FilingCardComponent implements OnInit {

  private _filingData;


  @Input() 
  set filingData(filingData: object) {
    this._filingData = filingData;
    // console.log(filingData);
    this.dueDate = this._filingData.dueDate;
    this.formatDate();
    this.startDate = this._filingData.startDate;
    this.comments = this._filingData.comments;
    this.name = this._filingData.name;
    this.status = this._filingData.status;
    this.setStatus();
  };
  startDate = '';
  dueDate = '';
  comments = [];
  name = '';
  status = {
    stage: '',
    progress: ''
  };
  states = [
    {
      stage: 'Fund Scoping',
      progress: 'not-set'
    },
    {
      stage: 'Data Intake',
      progress: 'not-set'
    },
    {
      stage: 'Reporting',
      progress: 'not-set'
    },
    {
      stage: 'Client Review',
      progress: 'not-set'
    },
    {
      stage: 'Submission',
      progress: 'not-set'
    }
  ];
  statusMessage = ''


  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  formatDate() {
    let due = new Date(this.dueDate);
    // console.log(due);
    // console.log(this.dueDate);
    const newdate= ('0' + (due.getMonth() + 1)).slice(-2) + '/'
    + ('0' + due.getDate()).slice(-2) + '/'
    + due.getFullYear();
    this.dueDate = newdate;
  }

  setStatus() {
    let currentStatusFound = false;
    this.states.forEach( state => {
      if (this.status.stage === state.stage) {
        state['progress'] = this.status.progress;
        currentStatusFound = true; 
      } else if (this.status.stage !== state.stage && currentStatusFound === false) {
        state['progress'] = 'completed';
      } else {
        state['progress'] = 'not-set'
      }
    });
    this.statusMessage = 'Ready for ' + this.status.stage.toLowerCase(); //Placeholder 
    // console.log(this.states);
  }

  getStatus(index: number): string | null {
    // let state = 'not-set';
    index = index - 1;
    return this.states[index]['progress'];
  }

  routeToDetailsView(){
    // this.router.navigate(['/regulatory-filing-list/'+1]);
    this.router.navigate(['/r-reporting']);
  }


}
