import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { EycPbiService } from '../../../services/eyc-pbi.service';
import { EycRrSettingsService } from '../../../services/eyc-rr-settings.service';
import { SESSION_PBI_TOKEN, PBI_CONFIG } from '../../../config/rr-config-helper';
import { Location } from '@angular/common';

@Component({
  selector: 'lib-data-explorer-for-reporting-and-client',
  templateUrl: './data-explorer-for-reporting-and-client.component.html',
  styleUrls: ['./data-explorer-for-reporting-and-client.component.scss']
})
export class DataExplorerForReportingAndClientComponent implements OnInit, OnDestroy {

  filingList = [];
  periodList = [];
  selectedFiling: any;
  filingName: any;
  selectedPeriod: any;
  pbiQuestionList = [];
  form: FormGroup;
  filingDetails: any;
  PBIReportId: any;
  isUserInDataExplorerPage = false;
  activePod = PBI_CONFIG;
  dataSetId:any;
  constructor(
    private router: Router,
    private pbiServices: EycPbiService,
    private fb: FormBuilder,
    private filingService: RegulatoryReportingFilingService,
    private eycSettingsService: EycRrSettingsService,
    private location: Location
  ) {
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          (event.url === "/data-explorer") ? this.isUserInDataExplorerPage = true : this.isUserInDataExplorerPage = false;
        }
      });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      filingId: [''],
      period: [''],
      questionId: ['']
    });
    this.pbiServices.getFilingNames().subscribe(filingNamesRes => {
      this.filingList = filingNamesRes['data'];
      console.log("filingNamesRes", filingNamesRes);
      if (this.filingService.getFilingData) {

        console.log("selectedRes", this.filingService.getFilingData);

        if (this.isUserInDataExplorerPage) {
          this.filingDetails = this.filingService.getFilingData;
          this.form.patchValue({
            filingId: this.filingDetails.filingName,
            period: this.filingDetails.period,
          });

          this.form.get('filingId').valueChanges.subscribe(res => {
            this.filingName = this.filingList.find(item => item.filingName === res);
            this.PBIReportId = "";
            this.getPeriods();
            this.getPBIQuestions();
          });

          this.form.get('period').valueChanges.subscribe(res => {
            this.selectedPeriod = this.form.get('period').value;
          });

          this.form.get('questionId').valueChanges.subscribe(res => {
            this.PBIReportId = "";
            console.log("on question change res > ", res);
            console.log('changed question value > ',  this.form.controls.questionId.value);
            if (res) {
              this.getPowerBIReportID();
              this.selectedFiling = this.filingList.find(item => item.filingId === this.form.get('filingId').value);
              this.selectedPeriod = this.form.get('period').value;
            }
          });
        }
      } else {
        this.router.navigate(['home']);
        return;
      }
    });
  }

  ngOnDestroy() {
    this.eycSettingsService.deleteSessionKey(SESSION_PBI_TOKEN);
  }


  back() {
    this.location.back();
  }

  getPBIQuestions() {
    this.pbiServices.getPBIQuestion(this.filingName?.formId).subscribe(resp => {
      this.pbiQuestionList = resp['data'];
      // this.pbiQuestionList.sort(this.sortPBIQuestion)
      console.log(this.pbiQuestionList);
      this.form.patchValue({
        questionId: this.pbiQuestionList[0].id
      });
      // After API are ready will remove above line and uncomment below line
      // this.pbiQuestionList = resp['data'].filter(value => value.filingName === this.filingName?.filingName);
    });
  }

  sortPBIQuestion(a, b) {
    let que1 = a.questionName;
    let que2 = b.questionName;
    if (que1 > que2) {
      return 1;
    } else if (que1 < que2) {
      return -1;
    } else {
      return 0;
    }
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
    this.pbiServices.getPBIReportIDByFilingIdQuestionId(this.filingName?.formId, this.form.controls.questionId.value).subscribe(res => {
      console.log("PBI Response > ", res);
      this.PBIReportId = res['data']['pbiReportId'];
      this.dataSetId = res['data']['dataSetIds'];
      console.log("PBIReportId", res['data']);

      // After API are ready will remove above line and uncomment below line
      // let obj = res['data'].filter(value => value.id === this.form.get('questionId').value);
      // this.PBIReportId = obj[0].reportId;
    });
  }
}
