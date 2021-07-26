import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import {IS_USER_DETAILS_EDITABLE} from '../../../services/settings-helpers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {TeamsService} from '../services/teams.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';

@Component({
  selector: 'app-eyc-team-details',
  templateUrl: './eyc-team-details.component.html',
  styleUrls: ['./eyc-team-details.component.scss']
})
export class EycTeamDetailsComponent implements OnInit {

  constructor(private location: Location,
    private teamService:TeamsService,
    private activatedRoute: ActivatedRoute,) { }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  teamsListArr: any[] = [];
  isLocal = environment.SECURITY_ENABLED;
  teamInfo;
  curentTeamId;
  enableEditor = false;
  editTeamForm: FormGroup;
  showToastAfterEditUser = false;
  fullname;
  teamResp: any[] = [];
  is_editable = IS_USER_DETAILS_EDITABLE;
  columnDefs;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  tabIn;
  gridApi;
  teamsMemberData;
  displayCheckBox: boolean = true;
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.curentTeamId = params.teamId;
    });
    this.tabIn = 1;
    this.getTeamsData();
    this.getTeamMemberDetails();
  }

  backtoTeamVIew() {
    this.location.back();
  }

  onSubmitEditTeamForm(form: FormGroup) {
  }
  cancelForm() {
    this.showToastAfterEditUser = false;
    // this.editTeamForm.patchValue({
    //   first: this.teamInfo.userFirstName.trim(),
    //   last: this.teamInfo.userLastName.trim(),
    //   email: this.teamInfo.userEmail.trim()
    // });
    this.enableEditor = !this.enableEditor;
  }

  enableEditForm() {
    this.enableEditor = !this.enableEditor;
  }

  getTeamsData() {

    // Below code will inly work,if it is a local environment reading data from json
      if(this.isLocal){
      this.teamService.getTeamsDetailsList().subscribe(resp => {
          this.teamResp.push(resp);
        this.teamResp[0]['data'].forEach((item) => {
          this.teamsListArr.push(item);
        });
        this.teamInfo =  this.teamsListArr.filter(task => task.teamId == this.curentTeamId)[0];
        // if(this.teamInfo)
        // {
        //   this.editTeamForm.patchValue({
        //     teamName: "this.teamInfo.teamName.trim()",
        //     teamRole: "this.teamInfo.role.trim()",
           
        //     });
        // }
       

      });
    }  
   
    

  }

  getTeamMemberDetails() {

    // Below code will inly work,if it is a local environment reading data from json
    if (this.isLocal) {
      this.teamService.getTeamMemberList().subscribe(resp => {
        this.teamsMemberData = resp['data'];
        

      });
      this. createTeamsRowData();
     
    }



  }
  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  createTeamsRowData(): void {
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Name',
        field: 'memberName',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 350
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Email',
        field: 'memberEmail',
        sortable: false,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 950
      },
      {
        width: 80,
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: this.editAct.bind(this),
        headerName: 'Actions',
        field: 'Actions',
        sortable: false,
        filter: false,
      }
    ];

}

adminTabChange(selectedTab){
   
  this.tabIn = selectedTab;
  if(this.tabIn === 1) {
    this.displayCheckBox = false;
  // this.getTeamMemberDetails();
    setTimeout(() => { 
      this.displayCheckBox = true;
    }, 200);
  } else {
    this.displayCheckBox = false;
  }
}

// private _updateUser() {
//   return this.formBuilder.group({
//     first: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
//     last: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
//     email: ['', [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)]]
//   });
// }

  deleteTeamMember(row) {

  }

}
