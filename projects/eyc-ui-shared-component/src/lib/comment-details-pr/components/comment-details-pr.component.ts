import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent} from '../../modal/component/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EycTaxCommentApiService } from '../../services/eyc-tax-comment-api.service'
import { PermissionService } from '../../services/permission.service'
import * as FileSaver from 'file-saver';

@Component({
  selector: 'lib-comment-details-pr',
  templateUrl: './comment-details-pr.component.html',
  styleUrls: ['./comment-details-pr.component.scss']
})
export class CommentDetailsPrComponent implements OnInit {

  @Input() TaskCommentData:any;
  @Input() isArchived:any;
  
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
  entityId:any;
  entityType:any;
  showToastAfterSubmit = false;
  toastSuccessMessage:string = "";
  showReplies = false;
  replyCount:any;
  attachmentsCount:any=0;
  attachments:any;
  replyData:any = [];
  formattedTimes = [];
  criticalTag:string = "Critical";
  permissionStatus:boolean;
  replies:any;

  constructor(private commentService: EycTaxCommentApiService,
              private dialog: MatDialog,
              public permissions: PermissionService) { }

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
    this.replyCount = this.TaskCommentData.replyCount;
    this.attachments = this.TaskCommentData.attachments;
    this.replies = this.formatReplies(this.TaskCommentData.replies);

  }

   getCreatedBy(author: { userFirstName: string; userLastName: string; }, createdBy: string) {
    return !!author 
        ? author.userFirstName + ' ' + author.userLastName
        : createdBy;
  }

  formatTarget(target) {
    return target === 'EY' ? target : target.toLowerCase();
  }

  capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  handleStatusChangedResponse(res) {
    this.status = res['data'].status.toLowerCase();
  }

  setStatusComment(_status){ 
      const objData = {
        "status": _status
      };     
      this.commentService.updateTaskStatus(this.idTask, objData).subscribe(res => {
        this.handleStatusChangedResponse(res);
      }, error => {
        console.log('Error update status', error);
      });
  }

  deleteTag(tagName:any, tagId:any){
    const message = tagName.toLowerCase().startsWith('edit') ? 
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
      if(result.button == 'Yes') {
        this.commentService.deleteTag(this.idTask, tagId).subscribe(resp => {
          this.editRequired = tagId == 1 ? null : this.editRequired;
          this.includeDebrief = tagId == 2 ? null : this.includeDebrief;
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
      if(result.button == 'Yes') {
        const data = {
          "priority": 0
        }
        this.commentService.deletePriority(this.idTask, data).subscribe(resp => {
          this.priority = 0;                   
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

  formatReplies(_replies:any){
    this.replyData = [];
    this.replyData = _replies;
    this.replyData.forEach(comment => {
    comment.commentText = decodeURI(comment.commentText);
    comment.timeStamp = this.formatDate(comment.timeStamp);
    });
    return this.replyData;
  }

}
