import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { Location } from '@angular/common';
import { ViewFilingEntityExceptionService } from './../services/view-filing-entity-exception.service';
import { TableHeaderRendererComponent } from './../../table-header-renderer/table-header-renderer.component';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { CellRendererTemplateComponent, PermissionService } from 'eyc-ui-shared-component';
import { rr_module_name} from '../../../config/rr-config-helper';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-view-filing-entity-exception',
  templateUrl: './view-filing-entity-exception.component.html',
  styleUrls: ['./view-filing-entity-exception.component.scss']
})
export class ViewFilingEntityExceptionComponent implements OnInit, OnDestroy {

  dueDate
  filingId;
  period;
  filingName;
  entityName;
  stage;
  // exceptionAnswersDefs;
  exceptionAnswersDefsAgGrid;
  exceptionAnswersData;
  rowData;
  exceptionCnt;
  componentStage;
  entityId;
  moduleOriginated = rr_module_name;
  showComments = false;

  @ViewChild('expandExceptionTemplate')
  expandExceptionTemplate: TemplateRef<any>;
  @ViewChild('viewDetTemplate')
  viewDetTemplate: TemplateRef<any>;
  exportsHeader: string;
  @ViewChild('unresolveFilingTemplate')
  unresolveFilingTemplate: TemplateRef<any>;
  @ViewChild('resolveFilingTemplate')
  resolveFilingTemplate: TemplateRef<any>;
  filingDetails: any;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>
  commentsName: string;
  commentsCount: any;
  entityIdForComment: any;
  permissionStage: any;
  pageList = [100,200,300];
  pageSize =100;
  exportName: string;

  constructor(
    private filingService: RegulatoryReportingFilingService,
    private router: Router,
    private location: Location,
    public dialog: MatDialog,
    public permissions: PermissionService,
    private viewService: ViewFilingEntityExceptionService
  ) { 
    const navigation = this.router.getCurrentNavigation();
    if (navigation.extras.state) {
        this.componentStage = navigation.extras.state.componentStage;
    }
  }

  ngOnInit(): void {
    if (this.filingService.getFilingData) {
      this.componentStage = this.componentStage ? this.componentStage : sessionStorage.getItem("detailExcepStage");
      this.permissionStage = (this.componentStage == "Client review") ? "Client Review" : this.componentStage;
      this.filingDetails = this.filingService.getFilingData;
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
    this.exportName =   this.filingDetails.filingName + "_" + this.filingDetails.period+"_"+this.componentStage+"_Filing_Entities_Exception_Reports_";
    this.viewService.getAnswerExceptionReports(this.entityId, this.filingName, this.period, this.exceptionCnt, this.componentStage).subscribe(res => {
      this.exceptionAnswersData =  res.data['exceptionResultJason'];
      this.commentsCount = res.data['commentCountMap'];
      res.data['exceptionResultJason'].forEach(obj=>{
        obj['comments'] = this.commentsCount[obj.AuditFilingID] ? this.commentsCount[obj.AuditFilingID] : 0;
     })
      if (this.exceptionAnswersData) {
        this.createEntitiesRowData();
      } else {
        // this.exceptionAnswersDefs = [];
        this.createEntitiesRowData();
        this.exceptionAnswersDefsAgGrid = [];
      }
    });
  }
  createEntitiesRowData(): void {
    this.rowData = [];
    // this.exceptionAnswersDefs = [];
    this.exceptionAnswersDefsAgGrid = [];
    this.exceptionAnswersData.forEach(element => {
      this.rowData.push({
        AuditFilingID: element.AuditFilingID,
        AuditType: element.AuditType,
        exceptionReportName: element.Audit,
        Unresolved: element.Unresolved,
        Resolved: element.Resolved,
        comments: element.comments
      });
    });
    // this.exceptionAnswersDefs = [
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.expandExceptionTemplate,
    //     },
    //     headerName: 'Exception Report Name',
    //     field: 'exceptionReportName',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 300,
    //     // comparator: this.disableComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.unresolveFilingTemplate,
    //     },
    //     headerName: 'Unresolved',
    //     field: 'Unresolved',
    //     sortable: true,
    //     filter: true,
    //     width: 210,
    //     // comparator: this.disableComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.resolveFilingTemplate,
    //     },
    //     headerName: 'Resolved',
    //     field: 'Resolved',
    //     sortable: true,
    //     filter: true,
    //     width: 210,
    //     // comparator: this.disableComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.commentExceptionTemplate,
    //     },
    //     headerName: 'Comments',
    //     field: 'comments',
    //     sortable: true,
    //     filter: true,
    //     width: 155,
    //     // comparator: this.disableComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: {
    //       ngTemplate: this.viewDetTemplate,
    //     },
    //     width: 50
    //   }
    // ]

    this.exceptionAnswersDefsAgGrid = [
      {
        valueGetter: "node.rowIndex + 1",
        maxWidth: 90,
        sortable: false,
        menuTabs: [],
        filter:false,
        pinned: 'left',
      },
      {
        headerName: 'Audit Filing ID',
        field: 'AuditFilingID',
        minWidth: 350,
        hide: true,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.expandExceptionTemplate,
        },
        headerName: 'Exception Report Name',
        field: 'exceptionReportName',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 350,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.unresolveFilingTemplate,
        },
        headerName: 'Unresolved',
        field: 'Unresolved',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 155,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.resolveFilingTemplate,
        },
        headerName: 'Resolved',
        field: 'Resolved',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 155,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.commentExceptionTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['reset']
        },
        sortable: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        minWidth: 155,
      },
      {
        cellRendererFramework: CellRendererTemplateComponent,
        cellRendererParams: {
          ngTemplate: this.viewDetTemplate,
        },
        maxWidth: 50
      }
    ]
  }

  redirecttoDataExplorer(event) {
    console.log('Data explorer');
  }

  backtoParent(stage) {
    this.location.back();
  }

  routeToEntityExceptionDetailsPage(event:any) {
    this.filingService.setExceptionData = event;

    if (sessionStorage.getItem('exceptionV3Stage') && sessionStorage.getItem('exceptionV3Stage') != undefined) {
      this.componentStage = sessionStorage.getItem("exceptionV3Stage");
    } 

    this.router.navigate(['/entity-exception-details'],{ state: { componentStage: this.componentStage }});
  }
  exportData() {
    this.exportsHeader = '';
    if (this.permissions.validatePermission(this.permissionStage, 'View Comments')) {
      this.exportsHeader = 'AuditFilingID:Audit Filing ID,Audit:Exception Report Name,Unresolved:Unresolved,Resolved:Resolved,commentCountMap:Comments';
    } else {
      this.exportsHeader = 'AuditFilingID:Audit Filing ID,Audit:Exception Report Name,Unresolved:Unresolved,Resolved:Resolved';
    }
    this.viewService.exportData(this.entityId, this.filingName, this.period, this.exceptionCnt, this.exportsHeader, this.componentStage).subscribe(res => {
    
    });
    
  }

  disableComparator(data1, data2) {
    return 0; 
  }
  checkFilingCompletedStatus(){
    return this.filingService.checkFilingCompletedStatus(this.filingDetails);
  }
 
  
  addCommentToException(row) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: row.AuditFilingID ? row.AuditFilingID : null,
        entityType: "Answer Data Exception Report",
        moduleOriginated: rr_module_name,
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails: {
            label: "Comment (required)",
            formControl: 'comment',
            type: "textarea",
            validation: true,
            validationMessage: "Comment is required"
          }
        },
        footer: {
          style: "start",
          YesButton: "Submit",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        this.exceptionAnswersData[this.exceptionAnswersData.findIndex(item => item.AuditFilingID === row.AuditFilingID)].comments = 1;
        this.commentsCount[row.AuditFilingID] = 1;
        this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
  }

  openComments(row) {
    this.commentsName = this.filingName + ' // ' + this.period;
    this.entityIdForComment = row.AuditFilingID;
    this.showComments = true;
    console.log(this.entityIdForComment);
  }

  commentAdded() {
    this.getAnswerExceptionReports();
  }

  ngOnDestroy(){
    sessionStorage.removeItem("detailExcepStage");
  }

}
