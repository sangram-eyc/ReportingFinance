import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaxCommentModalComponent } from '../../shared/tax-comment-modal/tax-comment-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TaxCommentService } from '../services/tax-comment.service';
import { ProductionCycleService } from '../services/production-cycle.service';
import { PermissionService } from 'eyc-ui-shared-component';

@Component({
  selector: 'comments-page',
  templateUrl: './comments-page.component.html',
  styleUrls: ['./comments-page.component.scss']
})

export class CommentsPagecomponent implements OnInit {

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private commentService: TaxCommentService,
    private productcyclesService: ProductionCycleService,
    public permissions: PermissionService
  ) { }

  isData: boolean = false;
  completedComments: any[] = [];
  filteredComments:any[] = [];
  pageName: string = 'Comments-Page';
  fundName: string;
  fundId: string;
  productCycleName: string;
  isApproved: boolean = false;
  hasOpenComments: boolean = false;
  showOnlyOpenComments:boolean = false;

  toastSuccessMessage = '';
  showToastAfterSubmit = false;
  permissionApproval = this.permissions.validatePermission('Production Cycles', 'Fund Approval');

  ngOnInit(): void {
    //Get the production-cycle-details values
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.fundId = params.id
      this.productCycleName = params.prodCycleName
      this.isApproved = params.status === "approved";
      this.hasOpenComments = params.openCommentsEY > 0 || params.openCommentsClient > 0;
      console.log('params -->', params);
    });
    //Get all the comments related with the selected Production-Cycle and Fund.
    
    this.getComments()
  }

  showOpenComments(){
    this.showOnlyOpenComments = !this.showOnlyOpenComments 
    this.showOnlyOpenComments ? this.filter("OPEN") : this.filteredComments = this.completedComments
  }

  filter(status)  {
    if (status != "") {
      this.filteredComments = this.completedComments.filter( taskcomment => taskcomment.status == status)
    }
  } 

  getComments() {
    this.completedComments = [];
    this.commentService.getTasksData(this.fundId).subscribe(resp => {
      console.log("call all comments", resp);
      resp['data'].length === 0 ? this.isData = false : this.isData = true;
      this.hasOpenComments = false;
      resp['data'].forEach((item : any) => {
        const eachitem: any = {
          id: item.id,
          entityId: item.entityId,
          entityType: item.entityType,
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
          attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
          attachments:item.attachments 
        };
        this.completedComments.push(eachitem);
        this.updateHasOpenComments(item.status);
        this.filteredComments = this.completedComments
      });
    })
  }

  commentStatusUpdated(commentItem: { id: any; status: any; }) {
    var updatedComment = this.completedComments.find(item => item.id === commentItem.id);
    if (!!updatedComment) {
      updatedComment.status = commentItem.status;
    }
    this.hasOpenComments = this.completedComments.some(item => this.isOpenStatus(item.status));
  }

  updateHasOpenComments(commentStatus: string) {
    this.hasOpenComments = this.hasOpenComments || this.isOpenStatus(commentStatus);
  } 

  isOpenStatus(status: string): boolean {
    return status.toLowerCase() === 'open'
  }

  backtoCycleView() {
    this.location.back();
  }

  addCommentToFund() {
    const dialogRef = this.dialog.open(TaxCommentModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "New comment",
        description: ``,
        entityId: this.fundId,
        entityType: "funds",
        forms: {
          isSelect: true,
          selectDetails: {
            label: "Scope",
            formControl: 'assignTo',
            type: "select",
            data: [
              { name: this.fundName, id: '1' },
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
          YesButton: "Post",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button === "Post") {
        //Refresh comments Submit
        this.toastSuccessMessage = "Comment added successfully";
        this.showToastAfterSubmit = true;
        setTimeout(() => {
          this.showToastAfterSubmit = false;       
        }, 4000); 
        this.getComments();
      } else {
        console.log('result afterClosed', result);
      }
    });
  }

  approveToFund() {
    const dialogRef = this.dialog.open(TaxCommentModalComponent, {
      width: '550px',
      data: {
        type: "Confirmation",
        header: "Approve Selected",
        description: "Are you sure want to approve this workbook deliverables? This indicates that you have no further comments.",
        footer: {
          style: "start",
          YesButton: "Continue",
          NoButton: "Cancel"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button === "Continue") {
        //Refresh comments Submit       
        const body = {
          "status": "approved", 
          "fundIds": [this.fundId]
         }
        this.productcyclesService.putApproveEntities(body).subscribe(resp => {
          console.log(resp);
          this.isApproved = true;
          this.toastSuccessMessage = "Approved successfully";
          this.showToastAfterSubmit = true;
           setTimeout(() => {
            this.closeToast();
          }, 4000); 
        });
        //this.getComments();
        console.log("Fund: " + this.fundId)
      } else {
        console.log('result afterClosed', result);
      }
    });
  }

  canAddComments(): boolean {
    return !this.isApproved && this.permissions.validatePermission('Production Cycles', 'Add comments');
  }

  canApprove(): boolean {
    return this.permissionApproval && !this.isApproved && !this.hasOpenComments;
  }

  closeToast(){
    this.showToastAfterSubmit = false;
  }
}