import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { FilingCardComponent } from '../../shared/filing-card/filing-card.component';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from '../../shared/table-header-renderer/table-header-renderer.component';

@Component({
  selector: 'lib-regulatory-reporting-filing',
  templateUrl: './regulatory-reporting-filing.component.html',
  styleUrls: ['./regulatory-reporting-filing.component.scss']
})
export class RegulatoryReportingFilingComponent implements OnInit {

  @ViewChild('activeSlick', {static: false}) activeSlick: SlickCarouselComponent;

  constructor(
    private filingService: RegulatoryReportingFilingService
  ) { }

  activeFilings: any[] = [];
  completedFilings: any[] = [];
  activeLeftBtnDisabled = true;
  activeRightBtnDisabled = false;
  slideConfig = {
    slidesToShow: 4,
    arrows: false,
    dots: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1860,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }, 
      {
        breakpoint: 1859,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
        breakpoint: 1421,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }, {
        breakpoint: 1420,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 999,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },{
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  TableHeaderRendererComponent = TableHeaderRendererComponent;
  gridApi;
  rowData;
  rowClass = 'row-style';
  columnDefs;
  rowStyle= {
    height: '74px'
  }
  domLayout = 'autoHeight';
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;


  ngOnInit(): void {
    this.getFilingsData();
    
  }

  ngAfterViewInit(): void {

  }

  afterChange(e) {
    console.log(e);
    if (e.currentSlide === 0) {
      this.activeLeftBtnDisabled = true;
    } else {
      this.activeLeftBtnDisabled = false;
    }
    const slides = e.slick.$slides;
    if (slides[slides.length - 1].classList.contains('slick-active')) {
      this.activeRightBtnDisabled = true;
    } else {
      this.activeRightBtnDisabled = false;
    }
  }

  activePrevSlide() {
    const currentSlide = this.activeSlick.slides[0].carousel.currentIndex;
    if (currentSlide > 0) {
      this.activeSlick.slickPrev();
    }
    console.log(this.activeSlick.slides[0]);
  } 

  activeNextSlide() {
    const currentSlide = this.activeSlick.slides[0].carousel.currentIndex;
    if (currentSlide > 0) {
      this.activeSlick.slickPrev();
    }
  }

  getFilingsData() {
    this.filingService.getFilings().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.name + ' // ' + item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: item.comments,
          status: item.status
        };
        if (eachitem.status.stage === 'Submission' && eachitem.status.progress === 'completed') {
          this.completedFilings.push(eachitem);
        } else if (eachitem.startDate !== null ) {
          this.activeFilings.push(eachitem);
        }

      });
      console.log(this.activeFilings);
      console.log(this.activeFilings.length);
      this.createHistoryRowData();
    });
  }

  createHistoryRowData() {
    this.rowData = [];
    this.completedFilings.forEach( filing => {
      this.rowData.push({
        name: filing.name,
        comments: filing.comments.length,
        dueDate: this.formatDate(filing.dueDate),
        subDate: this.formatDate(filing.dueDate),
        exceptions: 0,
        resolved: 0
      })
    });
    this.columnDefs = [
      {
        headerName: '',
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.dropdownTemplate,
        },
        field: 'template',
        minWidth: 43,
        width: 43,
        sortable: false,
        cellClass: 'actions-button-cell',
        pinned: 'left'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Filing Report Name',
        field: 'name',
        sortable: true,
        filter: true,
        resizeable: true,
        minWidth: 240,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Comments',
        field: 'comments',
        sortable: true,
        filter: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Due date',
        field: 'dueDate',
        sortable: true,
        filter: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Submission date',
        field: 'subDate',
        sortable: true,
        filter: true,
        minWidth: 212
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Exceptions',
        field: 'exceptions',
        sortable: true,
        filter: true,
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Resolved',
        field: 'resolved',
        sortable: true,
        filter: true,
      },
    ]; 
    console.log('Completed Filings',this.completedFilings);
    console.log(this.rowData);
  }

  searchCompleted(input) {
    this.gridApi.setQuickFilter(input.el.nativeElement.value);
  }

  formatDate(timestamp) {
    let due = new Date(timestamp);
    console.log(due);
    console.log(timestamp);
    const newdate= ('0' + (due.getMonth() + 1)).slice(-2) + '/'
    + ('0' + due.getDate()).slice(-2) + '/'
    + due.getFullYear();
    return newdate;
  }

  isFirstColumn(params) {
    const displayedColumns = params.columnApi.getAllDisplayedColumns();
    const thisIsFirstColumn = displayedColumns[0] === params.column;
    
    return thisIsFirstColumn;
  };
    
  onGridReady(params)  {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  };

}
