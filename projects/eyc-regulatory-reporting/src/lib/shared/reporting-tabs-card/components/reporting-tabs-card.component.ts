import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-reporting-tabs-card',
  templateUrl: './reporting-tabs-card.component.html',
  styleUrls: ['./reporting-tabs-card.component.scss']
})
export class ReportingTabsCardComponent implements OnInit {

  tabIn;
  @Output() messageEvent = new EventEmitter<string>();
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tabIn = 1;
  }

  reportTabChange(selectedTab){
    this.tabIn = selectedTab;
    this.messageEvent.emit(this.tabIn)
  }

  dataExplorer() {
    this.router.navigate(['/data-explorer'])
  }
}
