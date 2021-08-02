import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import {IS_TEAM_DETAILS_EDITABLE} from '../../../services/settings-helpers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {TeamsService} from '../services/teams.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';
import { UsersService } from '../../users/services/users.service';
@Component({
  selector: 'app-eyc-team-details',
  templateUrl: './eyc-team-details.component.html',
  styleUrls: ['./eyc-team-details.component.scss']
})
export class EycTeamDetailsComponent implements OnInit {

  constructor(
    private location: Location,
    private teamService: TeamsService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

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
  is_editable = IS_TEAM_DETAILS_EDITABLE;
  columnDefs;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  tabIn;
  gridApi;
  teamsMemberData;
  displayCheckBox = true;
  showToastAfterDeleteTeams = false;
  showToastAfterAddTeamMember;
  addTeamMemberModal = false;
  addTeamMemberForm: FormGroup;
  users;
  multiSelectValues = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.curentTeamId = params.teamId;
    });
    this.tabIn = 1;
    this.getTeamsData();
    this.getTeamMemberDetails();
    this.getUsersList();
    this.addTeamMemberForm = this._createTeamMembers();
  }

  private _createTeamMembers () {
    return this.fb.group({
      members: ['', [Validators.required]],
    });
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

  getUsersList() {
    if(this.isLocal) {
      this.userService.getUsersList().subscribe(resp => {
        this.users = resp.data;
      });
    }
  }

  getTeamsData() {

    // Below code will inly work,if it is a local environment reading data from json
      if (this.isLocal){
      this.teamService.getTeamsDetailsList().subscribe(resp => {
          this.teamResp.push(resp);
          this.teamResp[0].data.forEach((item) => {
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
        this.teamsMemberData = resp.data;


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
        width: 370
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Email',
        field: 'memberEmail',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 370
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
  if (this.tabIn === 1) {
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

  deleteTeamMember(row){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: "Delete team member",
        description: "Are you sure you want to delete this team member from the team?",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result.button == 'Yes') {
  
      const teamsList = this.teamsMemberData;
      this.teamsMemberData = [];
      teamsList.splice(teamsList.findIndex(item => item.teamId === row.teamId),1);
      teamsList.forEach(ele => {
        this.teamsMemberData.push(ele);
      });
      
        this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
        setTimeout(() => {
          this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
        }, 5000);
      }
    });

  }

  addTeamMembers(event) {
    this.addTeamMemberModal = true;
  }

  onSubmitNewTeamMembers() {
    const obj = this.addTeamMemberForm.getRawValue();
    this.addTeamMemberModal = false
    // below code will change after api integration
    const teamMembersToAdd = {
      "members": obj.members,
    }
    const teamsList = this.teamsMemberData;
    this.teamsMemberData = [];
    teamsList.forEach(ele => {
      this.teamsMemberData.push(ele);
    });
    console.log('TEAM MEMBERS TO ADD', teamMembersToAdd);
    teamMembersToAdd.members.forEach((element, i) => {
      this.teamsMemberData.push({
        teamMemberId: this.teamsMemberData.length + i,
        memberEmail: element.userEmail,
        memberName: element.userFirstName + ' ' + element.userLastName
      })
    });
    this.addTeamMemberForm.reset();
    // this.addTeamMemberForm = this._createTeamMembers();
    console.log('AFTER FORM RESET', this.addTeamMemberForm);
    this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
    setTimeout(() => {
      this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
    }, 5000);
  }

  closeTeamMemberModal() {
    this.addTeamMemberModal = false;
    this.addTeamMemberForm.reset();
    this.multiSelectValues = null;
  }

  /**
   * 
   * Retry this method after upgrading motif version
   */
  removeChipMember(event, index) {
    console.log(index);
    console.log(this.multiSelectValues);
    this.multiSelectValues.splice(index, 1);
    this.multiSelectValues = [...this.multiSelectValues];
    console.log('AFTER SPLICE', this.multiSelectValues);
  }

  logEvent(event: any, type: string, model: any) {
    console.log(
        `Select Component Type: ${type}`,
        ' | $event output: ',
        event,
        ' | model value: ',
        model
    );
}

}
