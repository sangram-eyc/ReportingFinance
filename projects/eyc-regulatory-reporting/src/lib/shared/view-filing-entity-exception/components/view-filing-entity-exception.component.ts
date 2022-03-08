import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { Location } from '@angular/common';
import { ViewFilingEntityExceptionService } from './../services/view-filing-entity-exception.service';
import { TableHeaderRendererComponent } from './../../table-header-renderer/table-header-renderer.component';
import { customComparator } from 'eyc-ui-shared-component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';

@Component({
  selector: 'lib-view-filing-entity-exception',
  templateUrl: './view-filing-entity-exception.component.html',
  styleUrls: ['./view-filing-entity-exception.component.scss']
})
export class ViewFilingEntityExceptionComponent implements OnInit {

  dueDate
  filingId;
  period;
  filingName;
  entityName;
  stage;
  exceptionAnswersDefs;
  exceptionAnswersData;
  rowData;
  exceptionCnt = '';

  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  exportsHeader: string;

  constructor(
    private filingService: RegulatoryReportingFilingService,
    private router: Router,
    private location: Location,
    private viewService: ViewFilingEntityExceptionService
  ) { }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.dueDate = this.filingService.getFilingData.dueDate;
      // this.formatDate();
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      console.log("resolveException > ", this.filingService.filingEntityData.resolveException);
      if( this.filingService.filingEntityData.resolveException && this.filingService.filingEntityData.resolveException.indexOf("/") !== -1){ 
        let exceptionVal =  this.filingService.filingEntityData.resolveException.split("/");
        this.exceptionCnt = exceptionVal[1];
      }
      this.entityName = this.filingService.getFilingEntityData.entityName;
      this.stage = 'reporting'
      sessionStorage.setItem("reportingTab", '2'); 
      this.getAnswerExceptionReports();
    }
  }

  getAnswerExceptionReports() {
    this.viewService.getAnswerExceptionReports(this.entityName, this.filingName, this.period, this.exceptionCnt).subscribe(res => {
      this.exceptionAnswersData =  res.data['entityExceptionMap'];
      this.createEntitiesRowData();
    });
  }
  createEntitiesRowData(): void {
    this.rowData = [];
    this.exceptionAnswersData.forEach(element => {
      this.rowData.push({
        exceptionReportName: element.Audit,
        resolveOrException: element.Resolved + '/' + element.Exceptions
      });
    });
    this.exceptionAnswersDefs = [
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   headerName: 'Exception Report Type',
      //   field: 'exceptionReportType',
      //   sortable: true,
      //   filter: true,
      //   sort:'asc',
      //  comparator: customComparator,
      //  autoHeight: true,
      //  wrapText: true,
      //  width: 300
      // },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        // cellRendererFramework: MotifTableCellRendererComponent,
        // cellRendererParams: {
        //   ngTemplate: this.expandExceptionTemplate,
        // },
        headerName: 'Exception Report Name',
        field: 'exceptionReportName',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 300,
        sort:'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Resolved/Exception',
        field: 'resolveOrException',
        sortable: true,
        filter: true,
        width: 210,
      },
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   cellRendererFramework: MotifTableCellRendererComponent,
      //   cellRendererParams: {
      //     ngTemplate: this.viewDetTemplate,
      //   },
      //   width: 50
      // }
    ]
  }

  redirecttoDataExplorer(event) {
    console.log('Data explorer');
  }

  backtoParent(stage) {
    this.location.back();
  }

  routeToExceptionDetailsPage(event:any) {
    // this.filingService.setExceptionData = event;
    // this.router.navigate(['/']);
  }
  exportData() {
    this.exportsHeader = '';
    this.exportsHeader = 'Audit:Exception Report Name,Resolved:Resolved,Exceptions:Exception';
    this.viewService.exportData(this.entityName, this.filingName, this.period, this.exceptionCnt, this.exportsHeader).subscribe(res => {
     
    });
    
  }
}
