import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
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
    public permissions: PermissionService,
    private router:Router
  ) { }

  isData: boolean = false;
  completedComments: any[] = [];
  filteredComments:any[] = [];
  pageName: string = 'Comments-Page';
  fundName: string;
  fundId: string;
  type: string;
  productCycleName: string;
  isApproved: boolean = false;
  hasOpenComments: boolean = false;
  showOnlyOpenComments:boolean = false;
  cycleId:string;

  toastSuccessMessage = '';
  showToastAfterSubmit = false;
  permissionApproval = this.permissions.validatePermission('Production Cycles', 'Fund Approval');
  emptyCommentSearch = false;
  textTofind = "";
  filtersArray = ['authorTofind','description','priorityToFind','tagEditTofind','tagIncludeTofind'];
  taskCount:number = 0;
  openTaskCount:number = 0;
  acceptedTaskCount: number = 0;
  declinedTaskCount:number = 0; 

  ngOnInit(): void {
    //Get the production-cycle-details values
    this.activatedRoute.params.subscribe(params => {
      this.fundName = params.name
      this.fundId = params.id
      this.type = params.type
      this.productCycleName = params.prodCycleName
      this.isApproved = params.status === "Approved by client";
      this.hasOpenComments = params.openCommentsEY > 0 || params.openCommentsClient > 0;
      this.cycleId = params.cycleId;
      console.log('params -->', params);
    });
    //Get all the comments related with the selected Production-Cycle and Fund.
    
    this.getComments()
  }

  showOpenComments(){
    if(this.completedComments.length > 0){
      this.showOnlyOpenComments = !this.showOnlyOpenComments
      this.searchActiveComments(this.textTofind);    
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
          attachments:item.attachments,
          priorityToFind: item.priority == 1 ? "critical":"",
          tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
          tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
          authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
        };
        this.completedComments.push(eachitem);
        this.updateHasOpenComments(item.status);
      });
      this.filteredComments = this.completedComments;
      if (this.type.length > 0){
          this.filteredComments = this.filteredComments.filter(item => (item.target.toUpperCase() === this.type.toUpperCase() && item.status.toUpperCase() === "OPEN"));
          this.emptyCommentSearch = this.filteredComments.length === 0 ? true: false;        
        }
        this.countStatusTasks();
            
    })
  }
 
  commentStatusUpdated(commentItem: { id: any; status: any; }) {
    var updatedComment = this.completedComments.find(item => item.id === commentItem.id);
    if (!!updatedComment) {
      updatedComment.status = commentItem.status;
    }
    this.hasOpenComments = this.completedComments.some(item => this.isOpenStatus(item.status));
    this.countStatusTasks();
  }

  commentTagUpdateSearch(commentItem: { id: any; idTag: any; }){
    var updatedComment = this.completedComments.find(item => item.id === commentItem.id);
    if (!!updatedComment) {
      if(commentItem.idTag == 1){
        updatedComment.tagEditTofind = "";
        updatedComment.tags.splice(updatedComment.tags.findIndex(i => i.id == 1), 1);
      }else if(commentItem.idTag == 2){
        updatedComment.tagIncludeTofind = "";
        updatedComment.tags.splice(updatedComment.tags.findIndex(i => i.id == 2), 1);
      }      
    }
  }

  commentaddTagSearch(commentItem: { id: any; idTag: any; }){
    let addTag:any;
    var updatedComment = this.completedComments.find(item => item.id === commentItem.id);
    if (!!updatedComment) {
      if(commentItem.idTag == 1){
        addTag = {"id": 1,"name": "Edit Required"}
      }else if(commentItem.idTag == 2){
        addTag = {"id": 2,"name": "Include in cycle debrief"}
      }      
        updatedComment.tags.push(addTag)
      }      
    }
  

  commentPriorityUpdateSearch(commentItem: { id: any; priority: any; }){
    var updatedComment = this.completedComments.find(item => item.id === commentItem.id);
    if (!!updatedComment) {
      updatedComment.priority = commentItem.priority;
      updatedComment.priorityToFind = ""
    }
  }

  updateHasOpenComments(commentStatus: string) {
    this.hasOpenComments = this.hasOpenComments || this.isOpenStatus(commentStatus);
  } 

  isOpenStatus(status: string): boolean {
    return status.toLowerCase() === 'open'
  }

  backtoCycleView() {
    this.router.navigate(['cycle-details',this.cycleId,this.productCycleName]);
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

  searchCommentsValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  searchActiveComments(input){
    this.textTofind = typeof(input) === 'object' ? input.el.nativeElement.value.toLowerCase(): input.toLowerCase(); 
    if(this.completedComments.length > 0){
      this.filteredComments = this.completedComments.filter(element => {    
        return this.filtersArray.filter(filterElement => {          
          return element[filterElement].toLowerCase().indexOf(this.textTofind) > -1
          }).length > 0;
      });
      this.filteredComments = this.showOnlyOpenComments ? this.filteredComments.filter(item => item.status.toLowerCase() === "open"): this.filteredComments;
      this.filteredComments = this.type.length > 0 ? this.filteredComments.filter(item => (item.target.toUpperCase() === this.type.toUpperCase() && item.status.toLowerCase() === "open")): this.filteredComments;
      this.emptyCommentSearch = this.filteredComments.length === 0 ? true: false;
    }
  }

  onPasteSearchActiveComments(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 

  countStatusTasks(){
    if(this.type.length > 0){
      this.filteredComments = this.filteredComments.filter(item => (item.target.toUpperCase() === this.type.toUpperCase() && item.status.toUpperCase() === "OPEN"));
      this.taskCount = this.filteredComments.length;
      this.openTaskCount = this.taskCount;
      this.filteredComments.length === 0 ? this.isData = false : this.isData = true;
      this.hasOpenComments = this.filteredComments.length === 0 ? false: true;
      this.emptyCommentSearch = false; 
    }else{
      this.taskCount = this.completedComments.length;
      this.openTaskCount = this.completedComments.filter(item => item.status.toUpperCase() === "OPEN" ).length;
      this.acceptedTaskCount = this.completedComments.filter(item => item.status.toUpperCase() === "ACCEPTED" ).length;
      this.declinedTaskCount = this.completedComments.filter(item => item.status.toUpperCase() === "DECLINED" ).length;
    }
  }

}
