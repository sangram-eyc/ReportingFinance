import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProcessingExceptionService } from '../../services/processing-exception.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { ModalComponent } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'lib-data-sets',
  templateUrl: './data-sets.component.html',
  styleUrls: ['./data-sets.component.scss']
})
export class DataSetsComponent implements OnInit {

  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  gridApi;
  exceptionDefs;
  filingDetails: any;
  rowData = [];
  exceptionDetailCellRendererParams;


  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('commentExceptionTemplate')
  commentExceptionTemplate: TemplateRef<any>;
  @ViewChild('unresolveExceptionTemplate')
  unresolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('resolveExceptionTemplate')
  resolveExceptionTemplate: TemplateRef<any>;
  @ViewChild('resultTemplate')
  resultTemplate: TemplateRef<any>;


  constructor(private service: ProcessingExceptionService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getDataSets();
  }

  getDataSets() {
    this.service.getDataSets().subscribe(res => {
      console.log(res);
      this.rowData = res['data'];
      this.createEntitiesRowData();
    })
  }


  createEntitiesRowData(): void {
    const customComparator = (valueA, valueB) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
    };

    this.exceptionDefs = [
     /*  {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.dropdownTemplate,
        },
        field: 'template',
        headerName: 'Actions',
        width: 60,
        sortable: false,
        pinned: 'left'
      },*/
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due',
        field: 'exceptionDue',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 130
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'File',
        field: 'exceptionFile',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 150,
        // cellClass: 'custom-file',
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Source',
        field: 'source',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator,
        autoHeight: true,
        wrapText: true,
        width: 170
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.commentExceptionTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.unresolveExceptionTemplate,
        },
        headerName: 'Unresolved',
        field: 'unresolve_exception',
        sortable: true,
        filter: true,
        width: 150,
        cellClass: 'custom-unresolve',
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveExceptionTemplate,
        },
        headerName: 'Resolved',
        field: 'resolve_exception',
        sortable: true,
        filter: true,
        width: 140,
      },
      
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Review Level',
        field: 'reviewLevel',
        sortable: true,
        filter: true,
        sort: 'asc',
        comparator: customComparator
      },

    ];
  }


  addCommentToException() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
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
      // console.log('The dialog was closed', result);
      if (result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log(obj);

      } else {
        console.log(result);
      }
    });
  }

}
