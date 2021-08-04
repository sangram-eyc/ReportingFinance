import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import {IS_TEAM_DETAILS_EDITABLE,customComparator} from '../../../services/settings-helpers';
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


  constructor(private location: Location,
              private teamService: TeamsService,
              private activatedRoute: ActivatedRoute,
              private userService: UsersService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder) {
                this.editTeamForm = this._updateTeam();
               }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  teamsListArr: any[] = [];
  isLocal = environment.SECURITY_ENABLED;
  teamInfo;
  curentTeamId;
  enableEditor = false;
  editTeamForm: FormGroup;
  showToastAfterEditTeam = false;
  fullname;
  teamResp: any[] = [];
  teamsData;
  is_editable = IS_TEAM_DETAILS_EDITABLE;
  roleList =  [
        {
            role: 1,
            roleName: 'L1 Reviewer'
        },
        {
            role: 2,
            roleName: 'L2 Reviewer',
        }

    ];
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
  presentRole;


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
    return this.formBuilder.group({
      members: ['', [Validators.required]],
    });
  }

  backtoTeamVIew() {
    sessionStorage.setItem('adminTab', '1');
    this.location.back();
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
          this.teamsListArr.splice( this.teamsListArr.findIndex(item => item.teamName === this.teamInfo.teamName),1);
          this.presentRole = this.teamInfo.role === 'L1 Reviewer' ? this.presentRole = 1 : this.presentRole = 2;
          if (this.teamInfo)
        {
          this.editTeamForm.patchValue({
            teamName: this.teamInfo.teamName.trim(),
            role: this.presentRole,
            description: this.teamInfo.description.trim()
            });
        }

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
        width: 370,
        sort:'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Email',
        field: 'memberEmail',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 370,
        sort:'asc',
        comparator: customComparator
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
}

private _updateTeam() {
  return this.formBuilder.group({
    teamName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 \-\]+$'), Validators.maxLength(50), this.noWhitespaceValidator]],
    role: ['', [Validators.required]],
    description: ['', Validators.maxLength(250)],
  });
}

public noWhitespaceValidator(control: FormControl) {
  if (control.value.length === 0) {
    return false;
  } else {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
}



onSubmitEditTeamForm(form: FormGroup) {
  const obj = this.editTeamForm.getRawValue();
  if (this.editTeamForm.valid) {
    this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
    this.enableEditor = !this.enableEditor;
    setTimeout(() => {
    this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
    }, 5000);
  }
}

teamDuplicateCheck(event){
  let teamDupcheck = this.teamsListArr.findIndex(item => item.teamName === event);
  if(teamDupcheck != -1) {
    this.editTeamForm.controls['teamName'].setErrors({'teamDuplicate': true});
  }
}
  
cancelForm() {
  this.showToastAfterEditTeam = false;
  this.editTeamForm.patchValue({
    teamName: this.teamInfo.teamName.trim(),
    // role: this.presentRole,
    description: this.teamInfo.description.trim()
  });
  this.enableEditor = !this.enableEditor;
}


  deleteTeamMember(row){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: 'Confirmation',
        header: 'Delete team member',
        description: 'Are you sure you want to delete this team member from the team?',
        footer: {
          style: 'start',
          YesButton: 'Yes',
          NoButton: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Yes') {

      const teamsList = this.teamsMemberData;

      this.teamsMemberData = [];
      teamsList.splice(teamsList.findIndex(item => item.teamMemberId === row.teamMemberId), 1);
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
