import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { EycPbiService } from '../../../services/eyc-pbi.service';

@Component({
  selector: 'lib-data-explorer-for-reporting-and-client',
  templateUrl: './data-explorer-for-reporting-and-client.component.html',
  styleUrls: ['./data-explorer-for-reporting-and-client.component.scss']
})
export class DataExplorerForReportingAndClientComponent implements OnInit, AfterViewInit {

  filingList = [];
  periodList = [];
  selectedFiling: any;
  filingName: any;
  selectedPeriod: any;
  pbiQuestionList = [];
  form: FormGroup;
  filingDetails: any;
  PBIReportId: any;
  constructor(
    private router: Router,
    private pbiServices: EycPbiService,
    private fb: FormBuilder,
    private filingService: RegulatoryReportingFilingService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      filingId: [''],
      period: [''],
      questionId: ['']
    });

    this.getFilingNames();

    this.filingService.filingData.subscribe(res => {
      if (res === null) {
        this.router.navigate(['home']);
        return;
      }
      this.filingDetails = res;
      this.form.patchValue({
        filingId: res.filingId,
        period: res.period,
      });
    });

    if (this.filingDetails) {
      this.form.get('filingId').valueChanges.subscribe(res => {
        this.filingName = this.filingList.find(item => item.filingId === res);
        this.getPeriods();
        this.getPBIQuestions();
      });

      this.form.get('period').valueChanges.subscribe(res => {

      });

      this.form.get('questionId').valueChanges.subscribe(res => {
        if (res) {
          this.getPowerBIReportID();
          this.selectedFiling = this.filingList.find(item => item.filingId === this.form.get('filingId').value);
          this.selectedPeriod = this.form.get('period').value;
        }
      });
    }
  }

  ngAfterViewInit() {
  }

  back() {
    this.router.navigate(["/regulatory-reporting"])
  }

  getPBIQuestions() {
    this.pbiServices.getPBIQuestion(this.form.get('filingId').value).subscribe(resp => {
      // this.pbiQuestionList = resp['data'];
      // After API are ready will remove above line and uncomment below line
      this.pbiQuestionList = resp['data'].filter(value => value.filingName === this.filingName?.filingName);
    });
  }

  getFilingNames() {
    this.pbiServices.getFilingNames().subscribe(res => {
      this.filingList = res['data'];
    });
  }

  getPeriods() {
    this.pbiServices.getPeriods(this.filingName?.filingName).subscribe(res => {
      this.periodList = res['data'];
    });
  }

  getPowerBIReportID() {
    this.pbiServices.getPBIReportIDByFilingIdQuestionId(this.form.get('filingId').value, this.form.get('questionId').value).subscribe(res => {
      // this.PBIReportId = res['data'];
      // After API are ready will remove above line and uncomment below line
      let obj = res['data'].filter(value => value.id === this.form.get('questionId').value);
      this.PBIReportId = obj[0].reportId;
    });
  }
}
