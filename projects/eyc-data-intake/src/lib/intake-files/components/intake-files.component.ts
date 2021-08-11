import { Component, OnInit } from '@angular/core';
import { IntakeFilesService } from './../services/intake-files.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-intake-files',
  templateUrl: './intake-files.component.html',
  styleUrls: ['./intake-files.component.scss']
})
export class IntakeFilesComponent implements OnInit {

    filesLiastArr;

  constructor(private service: IntakeFilesService, private router: Router, ) { }
  ngOnInit(): void {
    this.getIntakeFilesList();
  }

  getIntakeFilesList() {
    this.service.getIntakeFilesList().subscribe(res => {
      this.filesLiastArr = res['data'];
    });
  }

  routeToexceptions() {
    this.router.navigate(['/processing-exceptions']);
  }

}
