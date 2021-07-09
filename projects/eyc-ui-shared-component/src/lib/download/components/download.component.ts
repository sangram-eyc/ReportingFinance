import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy  } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedDownloadService } from './../services/shared-download.service';

@Component({
  selector: 'lib-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnChanges, OnDestroy  {

  @Input() buttonLabel: any; 
  @Output() downloadFilesEmitter = new EventEmitter();
  @Input() downloadFilesList: any[];
  downloadList: any[] = [];
  fList: any[] = [];
  ngUnsubscribe = new Subject();
  showToastAfterDownload = false;
  downloadMsg: any;

  constructor(
    private sharedDownloadService: SharedDownloadService
  ) { }

  ngOnInit(): void {
    this.sharedDownloadService.downloadToasterMsg.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
     this.downloadMsg = res;
     this.showToastAfterDownload = !this.showToastAfterDownload;
      setTimeout(() => {
        this.showToastAfterDownload = !this.showToastAfterDownload;
      }, 5000); 
    });
  }

  

  ngOnChanges() {
    this.downloadFilesList ? this.fList = this.downloadFilesList : this.fList = [];
  }

  downloadAtttachment() {
    this.downloadList = [];
    const formData: any = new FormData();
    this.fList.forEach((item) => {
    this.downloadList.push(item['fileName']);
    });

    this.downloadFilesEmitter.emit(this.fList);

  }

  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
}
