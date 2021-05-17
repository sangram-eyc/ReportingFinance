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


  constructor(
    private router: Router
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


      handleStepClick($event: Event, currentStep: number, pagename: string) { // For clickable steps
          let redirect = 'no';
          if (currentStep < this.step) {
            redirect = 'yes';
          } else if (currentStep === this.step) {
            redirect = 'yes';
          }

          if (redirect === 'yes') {

            switch (pagename) {
              case 'scoping': {
                this.router.navigate(['fund-scoping']);
                break;
              }
              case 'intake': {
                this.router.navigate(['data-intake']);
                break;
              }
              case 'review': {
                this.router.navigate(['client-review']);
                break;
              }
              case 'reporting': {
                this.router.navigate(['regulatory-reporting']);
                break;
              }
              case 'submission': {
                this.router.navigate(['submission']);
                break;
              }
           }

          }

      }


}
