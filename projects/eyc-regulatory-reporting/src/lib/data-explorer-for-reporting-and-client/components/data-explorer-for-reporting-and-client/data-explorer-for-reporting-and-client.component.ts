import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {EycPbiService} from '../../../services/eyc-pbi.service';

@Component({
  selector: 'lib-data-explorer-for-reporting-and-client',
  templateUrl: './data-explorer-for-reporting-and-client.component.html',
  styleUrls: ['./data-explorer-for-reporting-and-client.component.scss']
})
export class DataExplorerForReportingAndClientComponent implements OnInit,AfterViewInit {
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
  selectedPeriod = "Q3 2021";
  currentPBIQuestions ='';
  pbiQuestionList = [];
  selectedReport;
  constructor(
    private router: Router, private pbiServices:EycPbiService
  ) { }

  ngOnInit(): void {
   
  }

  ngAfterViewInit()
  {
    this.getPBIQuestions();
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

  getPBIQuestions() {
    this.pbiServices.getPBIQuestion().subscribe(resp=>{
      this.pbiQuestionList = resp['data'].filter(value => value.filingName === this.selectedFiling );
      

    });
  }

  updateMotifCurrentTask(currentMotifTask) {
    this.selectedReport = this.pbiQuestionList.filter(value => value.filingName === this.selectedFiling); currentMotifTask
  }
}
