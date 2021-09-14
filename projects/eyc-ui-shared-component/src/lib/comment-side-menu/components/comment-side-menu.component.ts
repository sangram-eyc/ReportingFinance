import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { EycRrCommentApiService } from '../../services/eyc-rr-comment-api.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/component/modal.component';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'lib-comment-side-menu',
  templateUrl: './comment-side-menu.component.html',
  styleUrls: ['./comment-side-menu.component.scss']
})


export class CommentSideMenuComponent implements OnInit, OnDestroy {

  appContainer;
  formattedTimes = [];
  @Input() commentsData;
  @Input() filingName;
  @Input() show: boolean;
  @Input() entityId;

  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() commentAddedEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  // private _show: boolean;

  // @Input() set show(value: boolean) {
  //   this._show = value;
  //   this.viewComments(this._show);
  // }
 
  // get show(): boolean {
  //     return this._show;
  // }

  constructor(
    private commentService: EycRrCommentApiService,
    public dialog: MatDialog,
  ) {
    this.appContainer = document.getElementById('main-container');
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    console.log(this.entityId);
    if(this.entityId) {
      this.commentService.listComments(this.entityId).subscribe(resp => {
        this.commentsData = resp['data']
        this.formattedTimes = [];
        this.commentsData.forEach(comment => {
          this.formattedTimes.push(this.formatDate(comment.timeStamp));
          console.log(this.formattedTimes);
        });
      });
    }
    if (changes.show) {
      this.viewComments();
    }
  }

  ngOnDestroy(): void {
    this.appContainer.style.paddingRight = '0';
  }

  viewComments() {
    if (this.show) {
      this.openComments();
    } else {
      this.closeComments();
    }
  }

  openComments() {
    console.log('Calling Open Comments');
    this.appContainer.style.paddingRight = '25%';
    console.log(this.appContainer);
    this.show = true;
    this.showChange.emit(this.show);
  }

  closeComments() {
    this.appContainer.style.paddingRight = '0';
    this.show = false;
    this.showChange.emit(this.show);
  }

  addComment() {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '700px',
      data: {
        type: "ConfirmationTextUpload",
        header: "Add comment",
        description: `Please add your comment below.`,
        entityId: this.entityId,
        entityType: "FILING_ENTITY",
        forms: {
          isSelect: false,
          selectDetails: {
            label: "Assign to (Optional)",
            formControl: 'assignTo',
            type: "select",
            data:[
              { name: "Test1", id: 1 },
              { name: "Test2", id: 2 },
              { name: "Test3", id: 3 },
              { name: "Test4", id: 4 }
            ]
          },
          isTextarea: true,
          textareaDetails:{
            label:"Comment (required)",
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
      if(result.button === "Submit") {
        const obj = {
          assignTo: result.data.assignTo,
          comment: escape(result.data.comment),
          files: result.data.files
        }
        console.log('DIALOG CLOSE RESULT', result);
        console.log(obj);
        this.commentAddedEmitter.emit(true);
        this.commentService.listComments(this.entityId).subscribe(resp => {
          this.commentsData = resp['data'];
          this.formattedTimes = [];
          this.commentsData.forEach(comment => {
          this.formattedTimes.push(this.formatDate(comment.timeStamp));
          console.log(this.formattedTimes);
        });
        });
        // this.rowData[this.rowData.findIndex(item => item.entityId === row.entityId)].commentsCount = 1;
        // this.createEntitiesRowData();
      } else {
        console.log(result);
      }
    });
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
