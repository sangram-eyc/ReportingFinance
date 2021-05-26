import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-dots-card',
  templateUrl: './dots-card.component.html',
  styleUrls: ['./dots-card.component.scss']
})
export class DotsCardComponent implements OnInit, OnChanges {

  @Input() status: Object = {
    stage: 'Reporting',
    progress: 'in-progress'
  };

  dueDate = 'March 31 2021';

  states = [
    {
      stage: 'Fund Scoping',
      customCls: 'cust-fund',
      url: '/fund-scoping',
      curState: 'not-set',
      disabled: true
    },
    {
      stage: 'Intake',
      customCls: 'cust-intake',
      url: '/data-intake',
      curState: 'not-set',
      disabled: true
    },
    {
      stage: 'Reporting',
      customCls: 'cust-report',
      url: '/regulatory-reporting',
      curState: 'not-set',
      disabled: true
    },
    {
      stage: 'Client Review',
      customCls: 'cust-review',
      url: '/client-review',
      curState: 'not-set',
      disabled: true
    },
    {
      stage: 'Submission',
      customCls: 'last-item-class',
      url: '/submission',
      curState: 'not-set',
      disabled: true
    }
  ];


  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.setStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setStatus();
  }

  setStatus() {
    let currentStatusFound = false;
    this.states.forEach( state => {
      if (this.status['stage'] === state.stage) {
        state.curState = this.status['progress'];
        currentStatusFound = true;
        state.disabled = false;
      } else if (this.status['stage'] !== state.stage && currentStatusFound === false) {
        state.curState = 'completed';
        state.disabled = false;
      } else {
        state.curState = 'not-set';
      }
    });
  }

  getStatus(index: number): string | null {
    return this.states[index].curState;
  }

  disState(index: number): boolean | null {
    return this.states[index].disabled;
  }


      handleStepClick(pageUrl, enableRoute) { // For clickable steps
        if (!enableRoute) { this.router.navigate([pageUrl]); }
      }



}
