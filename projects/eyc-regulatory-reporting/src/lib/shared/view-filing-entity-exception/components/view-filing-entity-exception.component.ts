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
  exceptionCnt;
  componentStage;
  entityId;

  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  exportsHeader: string;
  @ViewChild('unresolveFilingTemplate')
  unresolveFilingTemplate: TemplateRef<any>;
  @ViewChild('resolveFilingTemplate')
  resolveFilingTemplate: TemplateRef<any>;

  constructor(
    private filingService: RegulatoryReportingFilingService,
    private router: Router,
    private location: Location,
    private viewService: ViewFilingEntityExceptionService
  ) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
      this.componentStage = navigation.extras.state.componentStage;
    }
  }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.dueDate = this.filingService.getFilingData.dueDate;
      // this.formatDate();
      this.filingName = this.filingService.getFilingData.filingName;
      this.period = this.filingService.getFilingData.period;
      this.filingId = this.filingService.getFilingData.filingId;
      console.log("resolveException > ", this.filingService.filingEntityData.resolveException);
      this.exceptionCnt = parseInt(this.filingService.getFilingEntityData.unResolvedException) + parseInt(this.filingService.getFilingEntityData.resolvedException);
      this.entityName = this.filingService.getFilingEntityData.entityName;
      this.entityId =  this.filingService.getFilingEntityData.fundId;
      this.stage = 'reporting'
      sessionStorage.setItem("reportingTab", '2'); 
      this.getAnswerExceptionReports();
    }
  }

  getAnswerExceptionReports() {
    this.viewService.getAnswerExceptionReports(this.entityId, this.filingName, this.period, this.exceptionCnt, this.componentStage).subscribe(res => {
      this.exceptionAnswersData =  res.data['entityExceptionMap'];
      this.createEntitiesRowData();
    });
  }
  createEntitiesRowData(): void {
    this.rowData = [];
    this.exceptionAnswersData.forEach(element => {
      this.rowData.push({
        exceptionReportName: element.Audit,
        Unresolved: element.Unresolved,
        Resolved: element.Resolved
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
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.unresolveFilingTemplate,
        },
        headerName: 'Unresolved',
        field: 'Unresolved',
        sortable: true,
        filter: true,
        width: 210,
        comparator: this.disableComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveFilingTemplate,
        },
        headerName: 'Resolved',
        field: 'Resolved',
        sortable: true,
        filter: true,
        width: 210,
        comparator: this.disableComparator
      },
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   headerName: 'Resolved/Exception',
      //   field: 'resolveOrException',
      //   sortable: true,
      //   filter: true,
      //   width: 210,
      // },
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
    this.viewService.exportData(this.entityId, this.filingName, this.period, this.exceptionCnt, this.exportsHeader, this.componentStage).subscribe(res => {
    
    });
    
  }

  disableComparator(data1, data2) {
    return 0; 
  }
}
