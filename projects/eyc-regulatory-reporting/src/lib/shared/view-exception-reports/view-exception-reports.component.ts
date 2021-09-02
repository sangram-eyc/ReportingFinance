import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RegulatoryReportingFilingService } from '../../../../src/lib/regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';
import {customComparator} from '../../config/rr-config-helper';
import { ViewExceptionReportsService } from './services/view-exception-reports.service';


@Component({
  selector: 'lib-view-exception-reports',
  templateUrl: './view-exception-reports.component.html',
  styleUrls: ['./view-exception-reports.component.scss']
})
export class ViewExceptionReportsComponent implements OnInit {

  dueDate;
  filingId;
  period;
  filingName;
  exceptionReportName;

  gridApi;
  exceptionAnswersDefs;
  exceptionAnswersData;

  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;


  constructor(
    private filingService: RegulatoryReportingFilingService,
    private viewService: ViewExceptionReportsService,
  ) { }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.dueDate = this.filingService.getFilingData.dueDate;
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      // console.log(this.filingService.getExceptionData);
      this.exceptionReportName = this.filingService.getExceptionData.exceptionReportName;
    }
    this.getAnswerExceptionReports();
  }

  getAnswerExceptionReports() {
    this.viewService.getAnswerExceptionReports(this.filingName, this.period, this.filingService.getExceptionData.exceptionId).subscribe(res => {
      this.exceptionAnswersData = res.data;
      this.createEntitiesRowData();

    });

  }

  createEntitiesRowData(): void {
    this.exceptionAnswersDefs = [
    ];


    for (const property in this.exceptionAnswersData[0]) {
      // console.log(`${property}: ${this.exceptionAnswersData[0][property]}`);
      if (property === 'comments') {
        this.exceptionAnswersDefs.push({
          field: `${property}`,
          headerName: `${property}`,
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.commentExceptionTemplate,
          }, sortable: true, autoHeight: true
        });
      }
      else {
        this.exceptionAnswersDefs.push({
          field: `${property}`,
          headerName: `${property}`,
          headerComponentFramework: TableHeaderRendererComponent,
          sortable: true, autoHeight: true,
          width: 250
        });
      }
    }





}


  formatDate() {
    const due = new Date(this.dueDate);
    const newdate = ('0' + (due.getMonth() + 1)).slice(-2) + '/'
    + ('0' + due.getDate()).slice(-2) + '/'
    + due.getFullYear();
    this.dueDate = newdate;
  }

  redirecttoDataExplorer(event) {
    console.log('Data explorer');
  }
}
