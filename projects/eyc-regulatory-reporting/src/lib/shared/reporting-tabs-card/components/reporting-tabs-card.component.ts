import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-reporting-tabs-card',
  templateUrl: './reporting-tabs-card.component.html',
  styleUrls: ['./reporting-tabs-card.component.scss']
})
export class ReportingTabsCardComponent implements OnInit {

  tabIn;

  constructor() { }

  ngOnInit(): void {
    this.tabIn = 1;
  }

  reportTabChange(selectedTab){
    this.tabIn = selectedTab;
  }

}
