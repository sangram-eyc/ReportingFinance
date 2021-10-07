import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
  tabIn:number=1;
  activeReports:any;

  activeReportsSearchNoDataAvilable:boolean;
  noActivatedDataAvilable:boolean;
  searchNoDataAvilable:boolean;
  constructor() { }

  ngOnInit(): void {
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }  

}
