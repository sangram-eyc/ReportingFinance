import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { IS_TEAM_DETAILS_EDITABLE, customComparator } from '../../../services/settings-helpers';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeamsService } from '../services/teams.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'eyc-ui-shared-component';
import { UsersService } from '../../users/services/users.service';
import { AdministrationService } from '@default/administration/services/administration.service';
@Component({
  selector: 'app-eyc-team-details',
  templateUrl: './eyc-team-details.component.html',
  styleUrls: ['./eyc-team-details.component.scss']
})
export class EycTeamDetailsComponent implements OnInit {


  constructor(private location: Location,
    private teamService: TeamsService,
    private adminService: AdministrationService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) {
    this.editTeamForm = this._updateTeam();
    const module = adminService.getCurrentModule;
    this.module = module.moduleName;
    this.moduleId = module.moduleId; 
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
  disableAddMemberButton = false;
  fullname;
  teamResp: any[] = [];
  teamsData;
  is_editable = IS_TEAM_DETAILS_EDITABLE;
  roleList = [];
  columnDefs;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  tabIn;
  gridApi;
  teamsMemberData: any[] = [];
  displayCheckBox = true;
  showToastAfterDeleteTeams = false;

  showToastAfterAddTeamMember;
  addTeamMemberModal = false;
  addTeamMemberForm: FormGroup;
  users;
  allUsers = []
  multiSelectValues = [];
  presentRole;
  module;
  moduleId;


  ngOnInit(): void {
    if (this.teamService.getTeamDetailsData) {
      const teamInfoObj = this.teamService.getTeamDetailsData;
      this.teamInfo = {
        "teamName": teamInfoObj.teamName,
        "teamDescription": unescape(teamInfoObj.teamDescription),
        "role": teamInfoObj.role
      }
    } else {
      this.location.back();
    }

    this.activatedRoute.params.subscribe(params => {
      this.curentTeamId = params.teamId;
      this.getTeamDetailsData();
    });
    this.tabIn = 1;
    this.teamService.getRoles(this.module).subscribe(resp => {
      this.roleList = resp['data'];
    })
    this.addTeamMemberForm = this._createTeamMembers();
  }

  private _createTeamMembers() {
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
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  getUsersList() {

    this.userService.getUsersList().subscribe(resp => {
      this.allUsers = resp.data
      this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
    });

  }

  getTeamDetailsData() {
    this.teamService.getTeamsDetails(this.curentTeamId).subscribe(resp => {
      this.editTeamForm.patchValue({
        teamName: this.teamInfo.teamName.trim(),
        role: this.teamInfo.role.trim(),
        teamDescription: this.teamInfo.teamDescription.trim()
      });
      this.getUsersList();
      this.teamsMemberData = [];
      resp['data'].teamMembers.forEach((element, i) => {
        this.teamsMemberData.push({
          userId: element.userId,
          userEmail: element.userEmail,
          memberName: element.userFirstName + ' ' + element.userLastName
        })
      });

      this.createTeamsRowData();
    });
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
        sort: 'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Email',
        field: 'userEmail',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 370,
        sort: 'asc',
        comparator: customComparator
      },
      {
        width: 80,
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: this.editAct.bind(this),
        headerName: 'Actions',
        field: 'userId',
        sortable: false,
        filter: false,
      }
    ];

  }

  adminTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

  private _updateTeam() {
    return this.formBuilder.group({
      teamName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 \-\]+$'), Validators.maxLength(50), this.noWhitespaceValidator]],
      role: ['', [Validators.required]],
      teamDescription: ['', Validators.maxLength(250)],
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
      this.enableEditor = !this.enableEditor;
      this.disableAddMemberButton = !this.disableAddMemberButton;
      const team = {
        "teamName": obj.teamName,
        "roleName": obj.role,
        "teamDescription": escape(obj.teamDescription),
        "moduleId": this.moduleId,
        "teamId": this.curentTeamId
      }
      this.teamInfo = [];
      this.teamService.EditTeam(team).subscribe(resp => {
        // this.teamInfo = resp['data'];
        const teamInfoObj = resp['data'];
        this.teamInfo = {
          "teamName": teamInfoObj.teamName,
          "teamDescription": unescape(teamInfoObj.teamDescription),
          "role": teamInfoObj.role
        }
        this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        setTimeout(() => {
          this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        }, 5000);
      });
    }
  }

  teamDuplicateCheck(event) {
    let teamDupcheck = this.teamsListArr.findIndex(item => item.teamName === event);
    if (teamDupcheck != -1) {
      this.editTeamForm.controls['teamName'].setErrors({ 'teamDuplicate': true });
    }
  }

  cancelForm() {
    this.showToastAfterEditTeam = false;
    this.editTeamForm.patchValue({
      teamName: this.teamInfo.teamName.trim(),
      role: this.teamInfo.role.trim(),
      teamDescription: this.teamInfo.teamDescription.trim()
    });
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }


  deleteTeamMember(row) {

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

        const deleteTeam = {
          "teamId": this.curentTeamId,
          "userId": [row.userId]
        }

        this.teamService.deleteTeamMember(deleteTeam).subscribe(resp => {
          const teamsList = this.teamsMemberData;
          this.teamsMemberData = [];
          teamsList.splice(teamsList.findIndex(item => item.userId === row.userId), 1);
          teamsList.forEach(ele => {
            this.teamsMemberData.push(ele);
          });
          this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));

          this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          setTimeout(() => {
            this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          }, 5000);

        });

      }
    });
  }

  addTeamMembers(event) {
    this.addTeamMemberModal = true;
  }

  onSubmitNewTeamMembers() {
    const obj = this.addTeamMemberForm.getRawValue();
    this.addTeamMemberModal = false
    const teamMembersToAdd = {
      "teamId": Number(this.curentTeamId),
      "userId": obj.members
    }
    this.teamService.addTeamMemebr(teamMembersToAdd).subscribe(resp => {
      this.teamsMemberData = [];
      resp['data'].forEach((element, i) => {
        this.teamsMemberData.push({
          userId: element.userId,
          userEmail: element.userEmail,
          memberName: element.userFirstName + ' ' + element.userLastName
        })
      });
      this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
      this.addTeamMemberForm.reset();
      console.log('AFTER FORM RESET', this.addTeamMemberForm);
      this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
      setTimeout(() => {
        this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
      }, 5000);
    });
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
