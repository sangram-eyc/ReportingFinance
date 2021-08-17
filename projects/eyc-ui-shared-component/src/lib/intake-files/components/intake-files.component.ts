import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-lib-intake-files',
  templateUrl: './intake-files.component.html',
  styleUrls: ['./intake-files.component.scss']
})
export class IntakeFilesComponent implements OnInit {

  constructor(private router: Router) { }

  
  @Input() filesData;
  @Input() buttonTxt;
  @Input() redirectURL;
  @Output() eventToParentFromIntakeFiles = new EventEmitter<any>();

  ngOnInit(): void {
  }

  routeToexceptions() {
    if(this.redirectURL) {
      let url = '/'+this.redirectURL;
    this.router.navigate([url]);
    }else { this.eventToParentFromIntakeFiles.emit(true); }
  }

}
