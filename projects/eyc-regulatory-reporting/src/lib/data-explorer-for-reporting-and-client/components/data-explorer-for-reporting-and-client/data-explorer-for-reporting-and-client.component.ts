import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { EycPbiService } from '../../../services/eyc-pbi.service';
import {EycRrSettingsService} from '../../../services/eyc-rr-settings.service';
import {SESSION_PBI_TOKEN} from '../../../config/rr-config-helper';

@Component({
  selector: 'lib-data-explorer-for-reporting-and-client',
  templateUrl: './data-explorer-for-reporting-and-client.component.html',
  styleUrls: ['./data-explorer-for-reporting-and-client.component.scss']
})
export class DataExplorerForReportingAndClientComponent implements OnInit,OnDestroy {

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
  constructor(
    private router: Router,
    private pbiServices: EycPbiService,
    private fb: FormBuilder,
    private filingService: RegulatoryReportingFilingService,
    private eycSettingsService:EycRrSettingsService
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
            this.getPeriods();
            this.getPBIQuestions();
          });

          this.form.get('period').valueChanges.subscribe(res => {
            this.selectedPeriod = this.form.get('period').value;
          });

          this.form.get('questionId').valueChanges.subscribe(res => {
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

  ngOnDestroy(){
   this.eycSettingsService.deleteSessionKey(SESSION_PBI_TOKEN);
  }


  back() {
    this.router.navigate(["/regulatory-reporting"])
  }

  getPBIQuestions() {
    this.pbiServices.getPBIQuestion(this.filingName?.formId).subscribe(resp => {
      this.pbiQuestionList = resp['data'];
      // After API are ready will remove above line and uncomment below line
      // this.pbiQuestionList = resp['data'].filter(value => value.filingName === this.filingName?.filingName);
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
    this.pbiServices.getPBIReportIDByFilingIdQuestionId(this.filingName?.formId, this.form.get('questionId').value).subscribe(res => {
      this.PBIReportId = res['data'];
      console.log("PBIReportId", this.PBIReportId);
      
      // After API are ready will remove above line and uncomment below line
      // let obj = res['data'].filter(value => value.id === this.form.get('questionId').value);
      // this.PBIReportId = obj[0].reportId;
    });
  }
}
