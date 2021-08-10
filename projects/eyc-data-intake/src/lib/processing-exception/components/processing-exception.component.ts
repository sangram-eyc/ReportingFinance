import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-processing-exception',
  templateUrl: './processing-exception.component.html',
  styleUrls: ['./processing-exception.component.scss']
})
export class ProcessingExceptionComponent implements OnInit {

  tabIn = 1;
  constructor() { }

  ngOnInit(): void {
  }

  back() {

  }

  onTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }
}
