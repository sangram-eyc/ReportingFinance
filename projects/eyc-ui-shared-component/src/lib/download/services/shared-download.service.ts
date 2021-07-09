import { Injectable, EventEmitter, Output } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class SharedDownloadService {

  @Output() downloadToasterMsg = new EventEmitter<any>();

  constructor() { }

  base64ToBlob(b64Data, sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); 
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
    return new Blob(byteArrays);
}

downloadAttachments(downloadMsg, downloadFilesRes) {
  downloadFilesRes.forEach((item: any) => {
  const data = this.base64ToBlob(item.file);
  FileSaver.saveAs(data, item.fileName);
  });
  this.downloadToasterMsg.emit(downloadMsg);
}


// downloadFilesRes = ["jobid" => 1, "jobid" => 2 ]
downloadAttachmentsforAsync(downloadFilesRes) {
  let myres;
  let requests = downloadFilesRes.map((item) => {
    return new Promise((resolve) => {
      // asyncFunction(item, resolve);
      //  need to trigger respective API call
    (item).subscribe((res23: any) => {
      myres.push(res23);
    });
    });
  })

    Promise.all(requests).then(() => {
      this.downloadAttachments(myres['message'], myres['data']);
    });
}


  
}
