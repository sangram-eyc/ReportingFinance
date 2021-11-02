import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Data, Router } from '@angular/router';
import { TaxCommentService } from '../services/tax-comment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

  @Input() TaskCommentData:any;
  @Output() onCommentStatusChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() onCommentTagDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCommentPriorityDeleted: EventEmitter<any> = new EventEmitter<any>();

  Requestfrom:string = 'Client'
  createdBy:string = 'Patrick Mahomes'
  createdDate:any;
  description:any;
  status:any;
  target:any;
  company:any;
  editRequired:any;
  includeDebrief:any;
  priority:number;
  idTask:any;
  showReplyComment:boolean = false;
  showReplyCommentButton:boolean = true;
  statusSelected:string ='open';
  ReplayForm: FormGroup;
  entityId:any;
  entityType:any;
  showToastAfterSubmit = false;
  toastSuccessMessage = "Comment added successfully";
  showReplies = false;
  replyCount:any;
  attachmentsCount:any=0;
  attachments:any;
  replyData:any = [];
  formattedTimes = [];
  criticalTag:string = "Critical";


  constructor(
    private router: Router,
    private commentService: TaxCommentService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public permissions: PermissionService
  ) {

    this.ReplayForm = this.fb.group({
      comment: ['', [Validators.required, Validators.maxLength(250), this.noWhitespaceValidator]],
      statusReplay:['open']
    });
  }

  permissionStatus= this.permissions.validatePermission('Production Cycles', 'Update task status');

  ngOnInit(): void {
    this.createdDate = this.TaskCommentData.createdDate;
    this.createdBy = this.getCreatedBy(this.TaskCommentData.author, this.TaskCommentData.createdBy);
    this.description = this.TaskCommentData.description;
    this.status = this.TaskCommentData.status.toLowerCase();
    this.target = this.formatTarget(this.TaskCommentData.target);
    this.company = this.formatTarget(this.TaskCommentData.company);
    this.priority = this.TaskCommentData.priority;
    this.idTask = this.TaskCommentData.id;
    const tags = this.TaskCommentData.tags;
    this.editRequired = tags.find(tag => tag.id === 1);
    this.includeDebrief = tags.find(tag => tag.id === 2);
    this.entityId = this.TaskCommentData.entityId;
    this.entityType = this.TaskCommentData.entityType;
    this.replyCount = this.TaskCommentData.replyCount;
    this.attachmentsCount = this.TaskCommentData.attachmentsCount;
    this.attachments = this.TaskCommentData.attachments;
    console.log('task-comments-data-receiving',this.TaskCommentData);   
  }

  getCreatedBy(author: { userFirstName: string; userLastName: string; }, createdBy: string) {
    return !!author 
        ? author.userFirstName + ' ' + author.userLastName
        : createdBy;
  }

  setStatusComment(_status){ 
    console.log('set status comment-->', _status);    
    console.log('this.idTask-->', this.idTask); 
      const objData = {
        "status": _status
      };     
      this.commentService.updateTaskStatus(this.idTask, objData).subscribe(res => {
        this.handleStatusChangedResponse(res);
      }, error => {
        console.log('Error update status', error);
      });
  }

  handleStatusChangedResponse(res) {
    console.log('response update status', res);
    this.status = res['data'].status.toLowerCase();
    this.onCommentStatusChanged.emit(res['data']);
  }


  ReplyComment(){
    this.showReplyNewComment()
    console.log('form-->', this.ReplayForm);
    console.log('comment ->', this.ReplayForm.get('comment').value);
    console.log('status replay ->', this.ReplayForm.get('statusReplay').value);

    const commentObj = {
      "comment": escape(this.ReplayForm.get('comment').value),
      "entityId": this.idTask,
      "entityType": "TASK",
    };

    this.commentService.addComment(commentObj).subscribe(commentResponse =>{
      console.log('Reponse add Replay -->',commentResponse);
      if(this.permissionStatus){
        let newStatus = this.ReplayForm.get('statusReplay').value;
        console.log('newStatus -->',newStatus);
        const objStatus = {
          "status": newStatus
        };
        this.commentService.updateTaskStatus(this.idTask, objStatus).subscribe(statusResponse => {
          this.handleStatusChangedResponse(statusResponse);
          this.replyCount = this.replyCount + 1
          this.showToastAfterSubmit = true;
          this.replyData = [];
          setTimeout(() => {        
            this.closeToast();       
          }, 4000);
          this.showReplies = false; 
        }, error => {
          console.log('Error update status', error);
        });
      }else{
         console.log('you do not have permission to update the status.');
         this.replyCount = this.replyCount + 1
         this.showToastAfterSubmit = true;
         this.replyData = [];
         setTimeout(() => {        
          this.closeToast();       
        }, 4000);
        this.showReplies = false; 
      }
    }, error => {
      console.log('Error replay comment', error);
    });
  }

  cancelReplyComment(){
    this.showReplyNewComment();
    this.ReplayForm.patchValue({
      comment: '',
      statusReplay: 'open'
    });
  }
  
  showReplyNewComment(){
    this.showReplies = false;
    this.showReplyComment = !this.showReplyComment
    //this.showReplyCommentButton = !this.showReplyCommentButton
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  formatTarget(target) {
    return target === 'EY' ? target : target.toLowerCase();
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  closeToast(){
    this.showToastAfterSubmit = false;
    this.ReplayForm.patchValue({
      comment: '',
      statusReplay: 'open'
    });
  }

  getListComments(){
    this.showReplies = !this.showReplies;
    this.showReplyComment = false; 
    if(this.replyData.length === 0 && this.replyCount > 0){
      this.commentService.listComments(this.idTask).subscribe(resp => {     
        this.replyData = resp['data'];
          this.replyData.forEach(comment => {
            comment.commentText = unescape(comment.commentText);
            comment.timeStamp = this.formatDate(comment.timeStamp);
          });
      });
    }
  }

  formatDate(timestamp) {
    const seconds = Math.floor((+new Date() - +new Date(timestamp)) / 1000);
    if (seconds < 29) {
      return 'Just now';
    } // less than 30 seconds ago will show as 'Just now'
    const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
    };
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
        } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
        }
      }
    }
  }

  deleteTag(tagName:any, tagId:any){
    let message = tagName.toLowerCase().startsWith('edit') ? 
    "Are you sure want to remove the " + tagName.toLowerCase() + " tag from this comment? If you select yes, no further edits are required to close the comment.":
    "Are you sure to remove the " + tagName.toLowerCase() + " tag from this comment? If you select yes, then this comment will be excluded from the cycle debrief.";

    const dialogRef = this.dialog.open(ModalComponent, {
      id:'delete-tag',   
      width: '500px',
      data: {
        type: "Confirmation",
        header: tagName + " status",
        description: message,
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The deleteTag dialog was closed', result);
      if(result.button == 'Yes') {
        this.commentService.deleteTag(this.idTask, tagId).subscribe(resp => {
          console.log('response delete tag', resp);
          this.editRequired = tagId == 1 ? null : this.editRequired;
          this.includeDebrief = tagId == 2 ? null : this.includeDebrief;
          const tagDeleted = {
            "id": this.idTask,
            "idTag": tagId
          };
          this.onCommentTagDeleted.emit(tagDeleted);
        });   
      }
    });
  }

  deletePriority(tagName:any){
    const dialogRef = this.dialog.open(ModalComponent, {
      id:'delete-tag',   
      width: '500px',
      data: {
        type: "Confirmation",
        header: tagName + " status",
        description: "Are you sure want to remove the " + tagName.toLowerCase() + " tag from this comment?",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The deletePriority dialog was closed', result);
      if(result.button == 'Yes') {
        const data = {
          "priority": 0
        }
        this.commentService.deletePriority(this.idTask, data).subscribe(resp => {
          this.priority = 0;
          console.log('response delete tag', resp);
          const Prioritydeleted = {
            "id": this.idTask,
            "priority": 0
          };
          this.onCommentPriorityDeleted.emit(Prioritydeleted);                   
        });   
      }
    });
  }

  downloadFile(fileName, downloadfilename) {
    const type = fileName.split('.').pop();
    const requestobj = {
      "fileName": fileName,
      "fileType": type.toUpperCase()
    }

    this.commentService.downloadFile(requestobj).subscribe(resp => {
        const data = this.base64ToBlob(resp['data']['fileContent']);
        console.log('k1 > filename >', fileName);
        FileSaver.saveAs(data, downloadfilename);
    });  
  }

  public base64ToBlob(b64Data, contentType='text/xml', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }


}
