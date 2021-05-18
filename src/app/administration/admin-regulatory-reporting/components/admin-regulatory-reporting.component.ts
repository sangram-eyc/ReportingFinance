import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-regulatory-reporting',
  templateUrl: './admin-regulatory-reporting.component.html',
  styleUrls: ['./admin-regulatory-reporting.component.scss']
})
export class AdminRegulatoryReportingComponent implements OnInit {

  tabIn;
  constructor() { }

  ngOnInit(): void {
    this.tabIn = 2;
  }

  adminTabChange(selectedTab){
    this.tabIn = selectedTab;
  }

}
