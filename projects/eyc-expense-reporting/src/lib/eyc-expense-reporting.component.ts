import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-eyc-expense-reporting',
  templateUrl: './eyc-expense-reporting.component.html',
  styleUrls: ['./eyc-expense-reporting.component.scss']
})
export class EycExpenseReportingComponent implements OnInit {

  tabIn;
  constructor() { }

  ngOnInit(): void {
    this.tabIn = 1;
    //GET the list of reports (BE)
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
    if (selectedTab == 1) {
      
    }
    else if (selectedTab == 2) {
    
    }
    else if (selectedTab == 3) {
    
    }
    else if (selectedTab == 4) {
  
    }
    else if (selectedTab == 5) {
   
    }
  }

}
