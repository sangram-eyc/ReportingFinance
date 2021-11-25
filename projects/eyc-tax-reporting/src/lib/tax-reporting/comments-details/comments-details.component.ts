import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { TaxCommentService } from '../services/tax-comment.service';

@Component({
  selector: 'comments-details',
  templateUrl: './comments-details.component.html',
  styleUrls: ['./comments-details.component.scss']
})
export class CommentsDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private commentService: TaxCommentService) { }
  productCycleId;
  productCycleName;
  completedComments: any[] = [];
  rowData;
  columnDefs;
  exceptionDetailCellRendererParams;
  currentlySelectedPageSize = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };
  @ViewChild('statusComment')
  statusComment: TemplateRef<any>;
  @ViewChild('submitedTemplate')
  submitedTemplate: TemplateRef<any>;
  @ViewChild('completedCommentTemplate')
  completedCommentTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate')
  dateTemplate: TemplateRef<any>;
  tooltipFunCall = false;
  

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productCycleId = params.cycleId
      this.productCycleName = params.cycleName
    });
    this.getCommentsList(); 
  }

  ngAfterViewInit(): void {
    
  }

  backtoCycleView() {
    this.router.navigate(['cycle-details',this.productCycleId,this.productCycleName]);
  }

  
  getCommentsList(){
    this.completedComments = [];
    this.commentService.cycleCommentsDetails(this.productCycleId).subscribe(resp=>{
      console.log("call all comments", resp);
      resp['data'].forEach((item : any) => {
        const eachitem: any = {
          id: item.id,
          entityId: item.entityId,
          entityType: item.entityType,
          entityName:item.entityName,
          description: item.description,
          completedComment : item.description,
          status: item.status.toLowerCase(),
          priority: item.priority,
          target: item.target,
          company: item.company,
          author: item.author.userFirstName + " " + item.author.userLastName,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          tags: item.tags,
          replyCount: item.replyCount
        };
        this.completedComments.push(eachitem);
      });
      this.createCommentsRowData();
    });
  } 


  createCommentsRowData(){
    this.rowData = [];
    this.completedComments.forEach(item => {
      this.rowData.push({
        id: item.id,
        entityId: item.entityId,
        entityType: item.entityType,
        entityName:item.entityName,
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
        replyCount: item.replyCount
      })
    });
  
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.submitedTemplate,
        }, 
        headerName: 'Submitted by',
        field: 'author',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 250,
        sort:'asc'   
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Fund/entity workbook',
        field: 'entityName',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 250,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.completedCommentTemplate,
        },
        headerName: 'Comment/question',
        field: 'description',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 250,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.dateTemplate,
        },
        headerName: 'Date added',
        field: 'createdDate',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 200,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: {
          ngTemplate: this.statusComment,
        },
        headerName: 'Status',
        field: 'status',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 200,
        sort:'asc'
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Replies',
        field: 'replyCount',
        sortable: true,
        filter: true,       
        resizeable: true, 
        width: 200,
        sort:'asc'
      }
    ];
  }

  getTooltip(){
      const arrayTooltips = document.querySelectorAll(".motif-tooltip");
      arrayTooltips.forEach((userItem) => {
        document.querySelector('.motif-pagination-select-wrapper').appendChild(userItem);
        window.scrollTo( 0, window.scrollY + 1);
        window.scrollTo( 0, window.scrollY - 1);
      }); 
   }

}
