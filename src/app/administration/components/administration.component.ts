import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { UploadComponent } from './../../../../projects/eyc-ui-shared-component/src/lib/upload/components/upload.component';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  /* filesList: any = [];
  @ViewChild(UploadComponent) private uploadChild: UploadComponent; */

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  routeAdminRR(){
    this.router.navigate(['/admin-rr-dashboard']);
  }

 /*  uploadedFiles(emitiedFiles) {
    this.filesList = emitiedFiles;
  }

  attachDocument() {
    let files = [];
    const formData: any = new FormData();
    files = this.filesList;
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]._file, files[i]._file.name);
    }

    // once files has been uploaded clear queque
    alert(this.filesList.length + ' File(s) has been uploaded successfully');
    this.filesList = [];
    this.uploadChild.clearUploadQueue();
    
  } */

}
