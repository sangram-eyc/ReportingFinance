import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-processing-exception',
  templateUrl: './processing-exception.component.html',
  styleUrls: ['./processing-exception.component.scss']
})
export class ProcessingExceptionComponent implements OnInit {

  tabIn = 1;
  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  back() {
    this.location.back();
  }

  onTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }
}
