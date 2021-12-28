import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableHeaderRendererComponent } from '../../table-header-renderer/table-header-renderer.component';
import { customComparator } from '../../shared-helper';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';

@Component({
  selector: 'shared-lib-intake-files',
  templateUrl: './intake-files.component.html',
  styleUrls: ['./intake-files.component.scss']
})
export class IntakeFilesComponent implements OnInit {

  constructor(private router: Router) { }

  
  @Input() filesData;
  @Input() buttonTxt;
  @Input() redirectURL;
  @Input() dataset;
  @Input() filesDatasets;
  @Output() eventToParentFromIntakeFiles = new EventEmitter<any>();
  @Output() datasetEvent = new EventEmitter<any>();
  @Output() commentClickEvent = new EventEmitter<any>();
  @Output() routeToExceptionDetailsEvent = new EventEmitter<any>();

  columnDefs;

  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;
  @ViewChild('commentTemplate')
  commentTemplate: TemplateRef<any>;
  @ViewChild('unresolveTemplate')
  unresolveTemplate: TemplateRef<any>;
  @ViewChild('resolveTemplate')
  resolveTemplate: TemplateRef<any>;

  ngOnInit(): void {
  }

  routeToexceptions() {
    if(this.redirectURL) {
      let url = '/'+this.redirectURL;
    this.router.navigate([url]);
    }else { this.eventToParentFromIntakeFiles.emit(true); }
  }

  createRowData(): void {
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Dataset',
        field: 'dataset',
        sortable: true,
        wrapText: true,
        autoHeight: true,
        filter: true,
        width: 300,
        comparator: customComparator,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'File Name',
        field: 'fileName',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 400,
        comparator: customComparator,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Report',
        field: 'report',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Source',
        field: 'source',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Data Owner',
        field: 'dataOwner',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Source Type',
        field: 'sourceType',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Data Owner Email',
        field: 'ownerEmail',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 400,
        comparator: customComparator
      },/* ,
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.commentTemplate,
        },
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: false,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.unresolveTemplate,
        },
        headerName: 'Unresolved',
        field: 'unresolve_exception',
        sortable: true,
        filter: false,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.resolveTemplate,
        },
        headerName: 'Resolved',
        field: 'resolve_exception',
        sortable: true,
        filter: false,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.viewDetTemplate,
        },
        width: 50
      } */
    ];
  }

  openAccord(index, event) {
    if (this.filesDatasets[index] === undefined) {
      this.datasetEvent.emit({index: index, event: event});
      this.createRowData();

      console.log('FILES DATASETS',this.filesDatasets);
    }
  }

  commentClicked() {
    this.commentClickEvent.emit();
  }

  routeToExceptionDetailsPage(event:any) {
    this.routeToExceptionDetailsEvent.emit(event);
    // this.filingService.setExceptionData = event;
    // this.router.navigate(['/view-exception-reports']);
  }

}
