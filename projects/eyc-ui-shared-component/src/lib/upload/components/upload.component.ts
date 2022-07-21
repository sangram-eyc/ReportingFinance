import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import * as helper from './../../shared-helper';

@Component({
  selector: 'lib-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  showToastAfterUploaded = false;
  uploadError = false;
  uploadErrorMsg;
  ngModelQueue: any;
  filesize: any[];
  maxsize: any;
  sharedHelper = helper;
  @Input() uploadURL: any;
  @Output() uploadedFilesEmitter= new EventEmitter<any>();

  uploaderURL: FileUploader = new FileUploader({url: ''});

  constructor(
  ) {

  }

  ngOnInit(): void {
  }

  filesUploaded(event: any) {
      this.uploaderURL.queue = Array.from(this.uploaderURL.queue.reduce((m, t) => m.set(t.file.name, t), new Map()).values());
      this.filesize = [];
      this.uploadError = false;

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.uploaderURL.queue.length; i++) {
        const filetype = this.uploaderURL.queue[i]._file.name.split('.').pop().toLowerCase();
        if (!this.sharedHelper.allowedFileTyes.includes(filetype)) {
                this.uploaderURL.queue[i].remove();
                setTimeout(() => {
                  this.uploadError = true;
                  this.uploadErrorMsg = this.sharedHelper.fileUploaInvalid;
                }, 0);
          }
          else {
            // console.log('file size exceeds');
            this.filesize.push(this.uploaderURL.queue[i]._file.size);
            this.maxsize = this.filesize.reduce((acc, cur) => acc + cur, 0);
            // console.log('file size > ', this.maxsize);
             if (this.maxsize > this.sharedHelper.MAX_FILE_SIZE) {
            this.uploaderURL.queue[i].remove();
              setTimeout(() => {
                this.uploadError = true;
                // tslint:disable-next-line: max-line-length
              this.uploadErrorMsg = this.sharedHelper.fileSizeLimit + (this.sharedHelper.MAX_FILE_SIZE / this.sharedHelper.MB_SIZE).toFixed(2) + 'MB';
              }, 0);
            } 
          }
      }

      if (!this.uploadError){
            this.uploadedFilesEmitter.emit(this.uploaderURL.queue);
      }

    // }

  }

  clearUploadQueue() {
    this.uploaderURL.clearQueue();
  }

  /* 
  removeItemfromQueque(index) {
    this.uploaderURL.queue[index].remove();
  } */

  removeAttachment(index) {
    this.uploaderURL.queue[index].remove();
  }

}
