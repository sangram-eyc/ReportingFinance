import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeamsService } from '../services/teams.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_PAGE_SIZE, customComparator, ModalComponent, PermissionService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { UsersService } from '../../users/services/users.service';
import { SettingService } from '../../services/setting.service';
import { AdministrationService } from '../../administration/services/administration.service';
import { IS_TEAM_DETAILS_EDITABLE } from '../../config/setting-helper';
import * as commonConstants from '../../shared/common-contstants'

@Component({
  selector: 'app-eyc-team-details',
  templateUrl: './eyc-team-details.component.html',
  styleUrls: ['./eyc-team-details.component.scss']
})
export class EycTeamDetailsComponent implements OnInit {

  exportHeaders;
  exportUrl: string;
  constructor(private location: Location,
    private teamService: TeamsService,
    private adminService: AdministrationService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public permissions: PermissionService,
    private apiHelpers: SettingService) {
    const module = adminService.getCurrentModule;
    this.module = module.moduleName;
    this.moduleId = module.moduleId;
    this.editTeamForm = this._updateTeam();

  }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  teamsListArr: any[] = [];
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
  assignments = [];
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
  selectedFilings = [];
  presentRole;
  module;
  moduleId;
  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  pageChangeFunc;
  
  ngOnInit(): void {
    if (this.teamService.getTeamDetailsData) {
      this.pageChangeFunc = this.onPageChange.bind(this);
      const teamInfoObj = this.teamService.getTeamDetailsData;
      this.teamInfo = {
        "teamName": teamInfoObj.teamName,
        "teamDescription": unescape(teamInfoObj.teamDescription),
        "role": teamInfoObj.role,
        "assignments": '',
        "assignmentsArray": []
      }
    } else {
      this.location.back();
    }

    this.activatedRoute.params.subscribe(params => {
      this.curentTeamId = params.teamId;
      this.getFilingAssignments();
      this.getTeamDetailsData(true);
    });
    this.tabIn = 1;
    if (this.permissions.validateAllPermission('adminPermissionList', this.module, 'Update Teams')) {
      this.teamService.getRoles(this.module).subscribe(resp => {
        this.roleList = resp['data'];
      })
    }
    this.addTeamMemberForm = this._createTeamMembers();
  }

  getFilingAssignments() {
    if (this.module == 'Regulatory Reporting') {
      this.teamService.getFileType().subscribe(res => {
        this.assignments = res['data']
      });
    }
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

  onPageChange() {
    this.getTeamDetailsData();
  }

  currentPageChange(event) {
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    this.pageSize = event;
    this.getTeamDetailsData();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getTeamDetailsData(true);
  }

  sortChanged(event) {
    switch(true) {
      case event === 'memberName:true':
        this.sort = 'userFirstName:true';
        break;
      case event === 'memberName:false':
        this.sort = 'userFirstName:false';
        break;
      default:
        this.sort =event;
    }
    this.getTeamDetailsData();
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  enableEditForm() {
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  getUsersList() {
    if (this.permissions.validateAllPermission('adminPermissionList', this.module, 'Update Teams')) {
      this.userService.getAllUsersList().subscribe(resp => {
        this.allUsers = resp.data
        this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
      });
    }
  }

  getTeamDetailsData(resetData = false) {
    this.sort = resetData ? 'userFirstName:true' : this.sort;
    this.teamService.getTeamsDetails(this.curentTeamId,this.currentPage,this.pageSize,this.sort,this.filter).subscribe(resp => {
      this.editTeamForm.patchValue({
        teamName: this.teamInfo.teamName.trim(),
        role: this.teamInfo.role.trim(),
        teamDescription: this.teamInfo.teamDescription.trim(),
        assignments: []
      });
      if (this.module == 'Regulatory Reporting') {
        this.teamInfo["assignments"] = resp['data'].assignments.map(item => (this.assignments.find(ele => ele.formId == item.entityId)).filingName);
        this.teamInfo["assignmentsArray"] = resp['data'].assignments;
        this.selectedFilings = resp['data'].assignments.map(item => item.entityId)
      }
      this.teamsMemberData = [];
      resp['data'].teamMembers.forEach((element, i) => {
        this.teamsMemberData.push({
          userId: element.userId,
          userEmail: element.userEmail,
          memberName: element.userFirstName + ' ' + element.userLastName
        })
      this.totalRecords=resp['totalRecords'];
      });
      if (resetData) {
        this.createTeamsRowData();
      } else {
        this.gridApi.setRowData(this.teamsMemberData);
      }
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
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 370,
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Email',
        field: 'userEmail',
        sortable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        width: 370,
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
    if (this.module == 'Regulatory Reporting') { 
      return this.formBuilder.group({
        teamName: ['', [Validators.required, Validators.pattern(commonConstants['EDIT_TEAM_REGEX_PATTERN'].TEAM_NAME), Validators.maxLength(50), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        teamDescription: ['', Validators.maxLength(250)],
        assignments: [[], [Validators.required]]
      });
    } else {
      return this.formBuilder.group({
        teamName: ['', [Validators.required, Validators.pattern(commonConstants['EDIT_TEAM_REGEX_PATTERN'].TEAM_NAME), Validators.maxLength(50), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        teamDescription: ['', Validators.maxLength(250)],
      });
    }
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
      let team;
      console.log(obj);
      
      if (this.module == 'Regulatory Reporting') { 
        team = {
          "teamName": obj.teamName.trim(),
          "roleName": obj.role,
          "teamDescription": escape(obj.teamDescription.trim()),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId,
          "assignments": obj.assignments.map(item => ({
            "entityId": item,
            "entityName": (this.assignments.find(ele => ele.formId == item)).filingName
          }))
        }
      } else {
        team = {
          "teamName": obj.teamName.trim(),
          "roleName": obj.role,
          "teamDescription": escape(obj.teamDescription.trim()),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId
        }
      }
      
      const dupTeamInfo = this.teamInfo;
      this.teamInfo = [];
      this.teamService.EditTeam(team).subscribe(resp => {
        // this.teamInfo = resp['data'];
        const teamInfoObj = resp['data'];
        if (this.module == 'Regulatory Reporting') {
          this.teamInfo = {
            "teamName": teamInfoObj.teamName.trim(),
            "teamDescription": unescape(teamInfoObj.teamDescription),
            "role": teamInfoObj.role,
            "assignments": teamInfoObj.assignments.map(item => (this.assignments.find(ele => ele.formId == item.entityId)).filingName),
            "assignmentsArray": teamInfoObj.assignments
          }
         } else {
          this.teamInfo = {
            "teamName": teamInfoObj.teamName.trim(),
            "teamDescription": unescape(teamInfoObj.teamDescription),
            "role": teamInfoObj.role,
          }
        }
        
        this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        setTimeout(() => {
          this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        }, 5000);
      }, error => {
        const teamDup = {
          "teamName": dupTeamInfo['teamName'].trim(),
          "role": dupTeamInfo['role'],
          "teamDescription": unescape(dupTeamInfo['teamDescription']),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId,
          "assignments": dupTeamInfo["assignments"],
          "assignmentsArray": dupTeamInfo["assignmentsArray"]
        }
        this.teamInfo = teamDup;

        this.editTeamForm.patchValue({
          teamName: this.teamInfo.teamName.trim(),
          role: this.teamInfo.role.trim(),
          teamDescription: this.teamInfo.teamDescription.trim()
        });
        this.selectedFilings = this.teamInfo.assignmentsArray.map(item => item.entityId);
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
    if (this.module == 'Regulatory Reporting') {
      this.selectedFilings = this.teamInfo.assignmentsArray.map(item => item.entityId);
    }
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
          this.updatePageSize(this.pageSize);
          this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          setTimeout(() => {
            this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          }, 5000);

        });

      }
    });
  }

  addTeamMembers(event) {
    this.getUsersList();
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
      this.updatePageSize(this.pageSize);
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
  
  filingTypeLogEvent(event, type, model) {
    this.editTeamForm.patchValue({
      assignments: model
    });
  }

  exportTeamsDetailsData() {
    this.exportHeaders = '';
    this.exportHeaders = 'userFirstName:First Name,userLastName:Last Name,userEmail:Email';
    this.exportUrl = this.apiHelpers.teams.teams_Details + "?teamId="+this.curentTeamId + "&module="+ this.module+"&teamName="+ this.teamInfo.teamName+"&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    console.log("export URL > ", this.exportUrl);
    this.teamService.exportTeamsDetailsData(this.exportUrl).subscribe(resp => {
      console.log(resp);
    })
  }

}
