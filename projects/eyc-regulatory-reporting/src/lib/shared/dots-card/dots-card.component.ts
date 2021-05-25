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

  step = 2;
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
      if (this.status.stage === state.stage) {
        state['curState'] = this.status.progress;
        currentStatusFound = true;
        state['disabled'] = false;
      } else if (this.status.stage !== state.stage && currentStatusFound === false) {
        state['curState'] = 'completed';
        state['disabled'] = false;
      } else {
        state['curState'] = 'not-set'
      }
    });
  }

  getStatus(index: number): string | null {
    return this.states[index]['curState'];
  }

  disState(index: number): boolean | null {
    return this.states[index]['disabled'];
  }

    // getStatus(index: number): string | null {
    //   console.log('getStatus',index);
    //   let state = 'not-set';
    //   if (index < this.step) {
    //     state = 'completed';
    //   } else if (index === this.step) {
    //     state = 'in-progress';
    //   }
    //   return state;
    // }

    // disState(index: number): boolean | null {
    //   this.states[index]['curState']
    //   let state = true;
    //   if (index < this.step) {
    //     state = false;
    //   } else if (index === this.step) {
    //     state = false;
    //   }
    //   return state;
    // }


      handleStepClick($event: Event, currentStep: number, pagename) { // For clickable steps
          let redirect = 'yes';
          
          // if (currentStep <= this.step) {
          //   redirect = 'yes';
          // }

          if (redirect === 'yes') {

            switch (pagename) {
              case 0: {
                this.router.navigate(['fund-scoping']);
                break;
              }
              case 1: {
                this.router.navigate(['data-intake']);
                break;
              }
              case 2: {
                this.router.navigate(['regulatory-reporting']);
                break;
              }
              case 3: {
                this.router.navigate(['client-review']);
                break;
              }
              case 4: {
                this.router.navigate(['submission']);
                break;
              }
           }

          }

      }


}
