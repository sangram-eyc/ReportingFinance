import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-dots-card',
  templateUrl: './dots-card.component.html',
  styleUrls: ['./dots-card.component.scss']
})
export class DotsCardComponent implements OnInit {

  step = 3;
  dueDate = 'March 31 2021';


  states = [
    {
      stage: 'Fund Scoping',
      customCls: 'cust-fund',
      url: '/fund-scoping',
      curState: 2
    },
    {
      stage: 'Intake',
      customCls: 'cust-intake',
      url: '/data-intake',
      curState: 2
    },
    {
      stage: 'Reporting',
      customCls: 'cust-report',
      url: '/regulatory-reporting',
      curState: 2
    },
    {
      stage: 'Client Review',
      customCls: 'cust-review',
      url: '/client-review',
      curState: 3
    },
    {
      stage: 'Submission',
      customCls: 'last-item-class',
      url: '/submission',
      curState: 4
    }
  ];


  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {

  }

    getStatus(index: number): string | null {
      let state = 'not-set';
      if (index < this.step) {
        state = 'completed';
      } else if (index === this.step) {
        state = 'in-progress';
      }
      return state;
    }

    disState(index: number): boolean | null {
      let state = true;
      if (index < this.step) {
        state = false;
      } else if (index === this.step) {
        state = false;
      }
      return state;
    }


      handleStepClick($event: Event, currentStep: number, pagename) { // For clickable steps
          let redirect = 'no';
          
          if (currentStep <= this.step) {
            redirect = 'yes';
          }

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
