import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import {
  TableHeaderRendererComponent,
  PanelRightCommentDetailsComponent,
} from 'eyc-ui-shared-component';
import { Subscription } from 'rxjs';
import { TaxCommentService } from '../services/tax-comment.service';
import { NgDialogAnimationService } from 'ng-dialog-animation';

@Component({
  selector: 'comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.scss'],
})
export class CommentsDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private commentService: TaxCommentService,
    public dialog: NgDialogAnimationService
  ) {}
  productCycleId;
  productCycleName;
  productCycleSubTitle: String =
    'Following details belong to all comments received from clients and EY users for ';
  completedComments: any[] = [];
  commentDetails: any;
  isArchived: boolean = false;
  rowData;
  columnDefs;
  columnDefsAgGrid;
  exportName;
  exceptionDetailCellRendererParams;
  currentlySelectedPageSize = {
    disable: false,
    value: 10,
    name: '10',
    id: 0,
  };
  @ViewChild('statusComment')
  statusComment: TemplateRef<any>;
  @ViewChild('submitedTemplate')
  submitedTemplate: TemplateRef<any>;
  @ViewChild('completedCommentTemplate')
  completedCommentTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate')
  dateTemplate: TemplateRef<any>;
  @ViewChild('fundTemplate')
  fundTemplate: TemplateRef<any>;
  @ViewChild('replyTemplate')
  replyTemplate: TemplateRef<any>;
  @ViewChild('tagsTemplate')
  tagsTemplate: TemplateRef<any>;
  tooltipFunCall = false;

  //Total-comments-box
  textCountNumber: number = 0;
  textCountComments: string = 'Total comments';

  //Donut Setup--
  totalFilesNumberFontSize: number = 10;
  totalFilesTextFontSize: number = 10;
  totalExpected = '';

  //Donut Setup for CLOSED Comments
  donut_id_closedC: string = 'closedCDonnut';
  donutByClosedText: string = 'CLOSED';
  donutByClosedColors: string[] = ['#57E188', '#FF736A'];
  totalClosedCommentsDetails = [];
  totalClosedComments: number = 0;

  //Donut Setup for OPEN Comments
  donut_id_openedC: string = 'openedCDonnut';
  donutByOpenedText: string = 'OPEN';
  donutByOpenedColors: string[] = ['#FF6D00', '#FFB46A'];
  totalOpenedCommentsDetails = [];
  totalOpenedComments: number = 0;

  //Toggle button for View My Assigned Funds--
  toggleLeftTitle: string = 'View my assigned funds';
  disabledLeftToggle: boolean = true;
  showOnlyMyAssignedFunds: boolean = false;
  getCommentsDetails: Subscription;
  lightVariant: string = 'monochrome-light';
  tagCritical: string = 'Critical';
  gridApi;
  searchNoDataAvilable = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.productCycleId = params.cycleId;
      this.productCycleName = params.cycleName;
      this.isArchived = params.isArchived === 'true';
    });

    this.getCommentsList();
  }

  ngAfterViewInit(): void {
    //this.setTooltips();
  }
  setTooltips(){
    setTimeout(()=>{
      const arrayTooltips = document.querySelectorAll('.motif-tooltip');
      arrayTooltips.forEach((userItem) => {
        document
          .querySelector('.ag-theme-material')
          .appendChild(userItem);
      });
        window.scrollTo(0, window.scrollY + 1);
    }, 500)
  }

  backtoCycleView() {
    this.router.navigate([
      'cycle-details',
      this.productCycleId,
      this.productCycleName,
    ]);
  }

  getCommentsList() {
    this.completedComments = [];
    this.commentService
      .cycleCommentsDetails(this.productCycleId)
      .subscribe((resp) => {
        resp['data'].forEach((item: any) => {
          if (item.fundDTO.totalComments > 0) {
            item.tasks.forEach((itemTask) => {
              const eachitem: any = {
                id: itemTask.id,
                entityId: item.fundDTO.id,
                entityName: item.fundDTO.name,
                description: itemTask.description,
                completedComment: itemTask.description,
                status: itemTask.status.toLowerCase(),
                priority: itemTask.priority,
                target: itemTask.target.toUpperCase(),
                company: itemTask.company,
                author:
                  itemTask.author != null
                    ? itemTask.author.userFirstName +
                      ' ' +
                      itemTask.author.userLastName
                    : itemTask.createdBy, //toDo if null
                createdBy: itemTask.createdBy,
                createdDate: itemTask.createdDate,
                tags: itemTask.tags,
                replyCount: itemTask.replyCount,
                assignedTo:
                  item.fundDTO.assignedUsers == null
                    ? []
                    : item.fundDTO.assignedUsers,
              };
              this.completedComments.push(eachitem);
            });
          }
        });
        this.createCommentsRowData(this.completedComments);
      });

    //Fill in the data on the graph
    this.getCommentsDetails = this.commentService
      .getCommentsDetailsPerProductCycle(this.productCycleId)
      .subscribe((res) => {
        this.totalOpenedComments = res.data.totalOpen;
        this.totalClosedComments = res.data.totalClosed;
        this.textCountNumber =
          Number(this.totalClosedComments) + Number(this.totalOpenedComments);

        let openByEY = res.data.open.find((status) => status.target === 'EY');
        let openByClient = res.data.open.find(
          (status) => status.target === 'CLIENT'
        );
        let AcceptedByEY = res.data.closed.find(
          (status) => status.target === 'EY' && status.status === 'ACCEPTED'
        );
        let DeclinedByEY = res.data.closed.find(
          (status) => status.target === 'EY' && status.status === 'DECLINED'
        );
        let AcceptedByClient = res.data.closed.find(
          (status) => status.target === 'CLIENT' && status.status === 'ACCEPTED'
        );
        let DeclinedByClient = res.data.closed.find(
          (status) => status.target === 'CLIENT' && status.status === 'DECLINED'
        );
        this.textCountNumber =
          Number(this.totalClosedComments) + Number(this.totalOpenedComments);

        this.totalOpenedCommentsDetails = [
          {
            label: 'Open client comments',
            value: openByClient != undefined ? openByClient.value : 0,
          },
          {
            label: 'Open EY comments',
            value: openByEY != undefined ? openByEY.value : 0,
          },
        ];

        this.totalClosedCommentsDetails = [
          {
            label: 'Accepted',
            value:
              (AcceptedByEY != undefined ? AcceptedByEY.value : 0) +
              (AcceptedByClient != undefined ? AcceptedByClient.value : 0),
          },
          {
            label: 'Declined',
            value:
              (DeclinedByEY != undefined ? DeclinedByEY.value : 0) +
              (DeclinedByClient != undefined ? DeclinedByClient.value : 0),
          },
        ];
      });
  }

  createCommentsRowData(rowData: any) {
    let rowDatafunds = rowData;
    this.rowData = [];
    rowDatafunds.forEach((item) => {
      this.rowData.push({
        id: item.id,
        entityId: item.entityId,
        entityName: item.entityName,
        description: item.description,
        splitComment: item.description.match(/.{1,35}/g),
        completedComment: item.completedComment.match(/.{1,50}/g),
        status: item.status,
        priority: item.priority,
        target: item.target,
        company: item.company,
        author: item.author,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        tags: item.tags,
        replyCount: item.replyCount,
        assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
        tagsToSearch:
          item.priority == 1
            ? this.splitTags(item.tags, true)
            : this.splitTags(item.tags, false),
      });
    });
    this.isToggleLeftDisabled();
    setTimeout(() =>{
      this.columnDefsAgGrid = [
        {
          valueGetter: 'node.rowIndex + 1',
          sortable: false,
          menuTabs: [],
          pinned: 'left',
          maxWidth: 70,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.submitedTemplate,
          },
          headerName: 'Submitted by',
          field: 'author',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
          minWidth: 250,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.fundTemplate,
          },
          headerName: 'Fund/entity workbook',
          field: 'entityName',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
          minWidth: 300,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.completedCommentTemplate,
          },
          headerName: 'Comment/question',
          field: 'description',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
          minWidth: 250,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dateTemplate,
          },
          headerName: 'Date added',
          field: 'createdDate',
          minWidth: 150,
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.statusComment,
          },
          headerName: 'Status',
          field: 'status',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
          minWidth: 150,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.replyTemplate,
          },
          headerName: 'Replies',
          field: 'replyCount',
          minWidth: 150,
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
        },
        {
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.tagsTemplate,
          },
          headerName: 'Tags',
          field: 'tagsToSearch',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          filter:true,
          resizable: true,
          minWidth: 350,
          maxWidth: 350
        },
      ];
    },);
    
    this.exportName = this.productCycleName || '' + '_comments_details_';
  }

  getTooltip() {
    /* var element = document.querySelector('.motif-tooltip-active');
    if (element != null) {
      document.querySelector('.ag-status-bar').appendChild(element);
      window.scrollTo(0, window.scrollY + 1);
      setTimeout(()=>{
        element.classList.add('motif-tooltip-clicked-cycle-details');
        window.scrollTo(0, window.scrollY - 1); 
      },500)         
    } */
  }

  showMyAssignedFunds() {
    if (this.completedComments.length > 0) {
      this.showOnlyMyAssignedFunds = !this.showOnlyMyAssignedFunds;
      if (this.showOnlyMyAssignedFunds) {
        let filterKey = sessionStorage.getItem('userEmail').toLowerCase();
        this.gridFilter(filterKey);
      } else {
        this.gridFilter('');
      }
    }
  }

  //Apply a filter to the grid
  gridFilter(filterKey: any) {
    if (filterKey.length > 0) {
      let arrfilterFunds = this.completedComments.filter((fund) => {
        let filterByFund = fund.assignedTo.find((assignedByFund) => {
          return assignedByFund.userEmail.toLowerCase() == filterKey;
        });
        let res = filterByFund == undefined ? false : true;
        return res;
      });
      this.createCommentsRowData(arrfilterFunds);
    } else {
      this.createCommentsRowData(this.completedComments);
    }
  }

  isToggleLeftDisabled() {
    if (this.completedComments.length > 0) {
      //if have at less one assigned the button is enabled so return false.
      for (let fund of this.completedComments) {
        if (fund.assignedTo.length > 0) this.disabledLeftToggle = false;
      }
    }
  }

  ngOnDestroy(): void {
    this.getCommentsDetails.unsubscribe();
  }

  openDialog(_idTaskComment): void {
    this.completedComments = [];
    this.commentService
      .getCommentExpandDetails(_idTaskComment)
      .subscribe((resp) => {
        const item = resp['data'].taskResponse;
        const _replies = resp['data'].repliesDetail;
        const comment: any = {
          id: item.id,
          entityId: item.entityId,
          description: item.description,
          status: item.status,
          priority: item.priority,
          target: item.target,
          company: item.company,
          author: item.author,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          tags: item.tags,
          replyCount: item.replyCount,
          attachments: item.attachments,
          priorityToFind: item.priority == 1 ? 'critical' : '',
          tagEditTofind:
            item.tags.length > 0
              ? item.tags.find((tag) => tag.id == 1) != undefined
                ? item.tags.find((tag) => tag.id == 1).name.toLowerCase()
                : ''
              : '',
          tagIncludeTofind:
            item.tags.length > 0
              ? item.tags.find((tag) => tag.id == 2) != undefined
                ? item.tags.find((tag) => tag.id == 2).name.toLowerCase()
                : ''
              : '',
          authorTofind:
            item.author != null
              ? item.author.userFirstName + ' ' + item.author.userLastName
              : item.createdBy,
          replies: _replies,
        };
        this.commentDetails = comment;
        const dialogRef = this.dialog.open(PanelRightCommentDetailsComponent, {
          width: '50%',
          height: '100%',
          panelClass:'comments-details-panel',
          data: {
            idTaskComment: _idTaskComment,
            dataComent: this.commentDetails,
            isArchived: this.isArchived,
          },
          position: { rowStart: '0' },
          animation: { to: 'left' },
        });

        dialogRef.afterClosed().subscribe((result) => {
          this.getCommentsList();
        });
      });
  }

  splitTags(arrayTags: any, flagCritical: boolean) {
    var result: string[] = [];
    if (arrayTags) {
      arrayTags.forEach((tag) => {
        result.push(tag.name);
      });
    }
    if (flagCritical) {
      result.push(this.tagCritical);
    }
    return result.join(',');
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  searchGrid(input) {
    this.gridApi.setQuickFilter(input);
    this.searchNoDataAvilable =
      this.gridApi.rowModel.rowsToDisplay.length === 0;
  }
}
