import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-data-explorer-for-reporting-and-client',
  templateUrl: './data-explorer-for-reporting-and-client.component.html',
  styleUrls: ['./data-explorer-for-reporting-and-client.component.scss']
})
export class DataExplorerForReportingAndClientComponent implements OnInit {
  filing = '';
  period = '';
  filingList = [
    'Form PF',
    'CPO-PQR',
    'N-PORT',
    'Test 1',
    'Test 2',
    'Test 3'
  ];
  
  periodList = [
    "Q1 2020",
    "Q2 2020",
    "Q3 2020",
    "Q4 2020"
  ];

  selectedFiling = "Form PF";
  selectedPeriod = "Q3 2020";
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  filingModelChanged(event) {
    if (this.filingList.includes(event)) {
      this.selectedFiling = event
    }
  }

  removeFilingChip() {
    this.selectedFiling = "";
  }

  periodModelChanged(event) {
    if (this.periodList.includes(event)) {
      this.selectedPeriod = event
    }
  }

  removePeriodChip() {
    this.selectedPeriod = "";
  }

  back() {
    this.router.navigate(["/regulatory-reporting"])
  }
}
