import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { TableHeaderRendererComponent } from './../../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { TeamsService } from './../services/teams.service';
import {Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { customComparator } from 'eyc-ui-shared-component';
import { AdministrationService } from '@default/administration/services/administration.service';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import {IS_SURE_FOOT} from '../../../services/settings-helpers';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import * as helpers from './../../../helper/api-config-helper';
@Component({
  selector: 'app-admin-regulatory-reporting',
  templateUrl: './admin-regulatory-reporting.component.html',
  styleUrls: ['./admin-regulatory-reporting.component.scss']
})
export class AdminRegulatoryReportingComponent implements OnInit, OnDestroy {

  apiHelpers = helpers.userAdminstration;
  tabIn;
  gridApi;
  columnDefs;
  teamsData;
  displayCheckBox: boolean = true;
  showToastAfterDeleteTeams = false;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  
  addTeamModal = false;
  addTeamForm: FormGroup;
  roles = []
  filingType = [];
  showToastAfterAddTeam = false;
  is_Tax_Reporting = IS_SURE_FOOT;
  moduleName;
  moduleId;
  exportHeaders;
  exportUrl: string;
  currentPage = 0;
  totalRecords = 5;
  pageSize = 10;
  filter = '';
  sort = '';
  pageChangeFunc;
  resetRowData = [];
  constructor(
    private teamsService: TeamsService,
    private adminService: AdministrationService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public permissions: PermissionService,
    public moduleLevelPermission: ModuleLevelPermissionService,
  ) {
    const module = adminService.getCurrentModule;
    this.moduleName = module.moduleName;
    this.moduleId = module.moduleId; 
    console.log('Current Module: ', module);
  }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;

  ngOnInit(): void {
    sessionStorage.getItem("adminTab") ? this.tabIn = sessionStorage.getItem("adminTab") : this.tabIn = 1;
    this.pageChangeFunc = this.onPageChange.bind(this);
    if (this.tabIn == 1) {
      this.getTeamList(true);
      if (this.permissions.validateAllPermission('adminPermissionList', this.moduleName, 'Add Teams')) {
        if (this.permissions.validateAllPermission('adminPermissionList', this.moduleName, 'View Roles')) {
          this.teamsService.getRoles(this.moduleName).subscribe(resp => {
            this.roles = resp['data'];
          });
        } else {
          this.openErrorModal("Access Denied", "User does not have access to view roles. Please contact an administrator.");
        }
      }
    }

    this.addTeamForm = this._createTeam()
  }

  getFilingAssignments() {
    if (this.moduleName == 'Regulatory Reporting') {
      this.teamsService.getFileType().subscribe(resp => {
        this.filingType = resp['data'];
      });
    }
  }

  private _createTeam () {
    if(this.moduleName == 'Regulatory Reporting') {
      return this.fb.group({
        teamName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \-\]+$'), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        filingType: ['', [Validators.required]],
        description: ['', [Validators.maxLength(250)]]
      });
    } else {
      return this.fb.group({
        teamName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \-\]+$'), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        description: ['', [Validators.maxLength(250)]]
      });
    }
  }

  adminTabChange(selectedTab){
    this.tabIn = selectedTab;
    if(this.tabIn === 1) {
      this.displayCheckBox = true;
      this.getTeamList();
    } else {
      this.displayCheckBox = false;
    }
  }

  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  onPageChange() {
    this.getTeamList();
  }

  currentPageChange(event) {
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    this.pageSize = event;
    this.getTeamList();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getTeamList();
  }

  sortChanged(event) {
    this.sort = event;
    this.getTeamList();
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  resetData() {
    this.createTeamsRowData();
    this.currentPage = 0;
    this.pageSize = 10;
    this.filter = '';
  }

  getTeamList(resetData = false) {
    this.sort = resetData ? 'teamName:true' : this.sort;
    if (this.permissions.validateAllPermission('adminPermissionList', this.moduleName, 'View Teams')) {
      this.getFilingAssignments();
      this.teamsService.getTeamsList(this.moduleName,this.currentPage,this.pageSize,this.sort,this.filter).subscribe(resp => {
        this.teamsData = resp.data;
        this.totalRecords=resp['totalRecords'];
        if (resetData) {
          this.createTeamsRowData();
        } else {
          this.gridApi.setRowData(this.teamsData);
        }
      }); 
    } else {
      this.openErrorModal("Access Denied", "User does not have access to view teams. Please contact an administrator.");
    }
  }

  disableComparator(data1, data2) {
    return 0; 
  }
  
  createTeamsRowData(): void {
    this.resetRowData = [];
    this.columnDefs = [];
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Team  Name',
        field: 'teamName',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 350,
        sort: 'asc',
        comparator: this.disableComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Role',
        field: 'role',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 200,
        comparator: this.disableComparator
      },

      // Commenting this column as part of User Story 299890: Assign filing type to new team
      // {
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   headerName: 'Assignments',
      //   field: 'numberOfAssignments',
      //   sortable: true,
      //   filter: false,
      //   wrapText: true,
      //   autoHeight: true,
      //   width: 150,
        
      // },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Members',
        field: 'numberOfTeamMembers',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 150,
        comparator: this.disableComparator
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
      },
    ];
    this.resetRowData = this.teamsData;
}

deleteTeams(row){

  const dialogRef = this.dialog.open(ModalComponent, {
    width: '500px',
    data: {
      type: "Confirmation",
      header: "Delete team",
      description: "Are you sure you want to delete this team from the system?",
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
    this.teamsService.deleteTeam(row.teamId).subscribe(resp => {
      const teamsList = this.teamsData;
      this.teamsData = [];
      teamsList.splice(teamsList.findIndex(item => item.teamId === row.teamId),1);
      teamsList.forEach(ele => {
        this.teamsData.push(ele);
      });
      this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
      setTimeout(() => {
        this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
      }, 5000);  });
    }
  });

  
}
editTeams(row) {
  this.teamsService.setTeamDetailsData = row;
  this.router.navigate(['/team-details/' + row.teamId]);
}

  addTeam(newTeam) {
    this.addTeamModal = true;
  }

  onSubmitNewTeam() {
    const obj = this.addTeamForm.getRawValue();
    this.addTeamModal = false;
    let team
    if(this.moduleName == 'Regulatory Reporting') {
    let selectedFilingTypes = this.getFillingTypes(obj);
      team = {
        "teamName": obj.teamName.trim(),
        "roleName": obj.role,
        "teamDescription": obj.description ? escape(obj.description.trim()):'',
        "moduleName": this.moduleName,
        "assignments": this.getAssignments(selectedFilingTypes)
      }
    } else {
      team = {
        "teamName": obj.teamName.trim(),
        "roleName": obj.role,
        "teamDescription": obj.description ? escape(obj.description.trim()):'',
        "moduleName": this.moduleName
      }
    }
    
    this.teamsService.addTeam(team).subscribe(resp => {
      const teamsList = this.teamsData;
      this.teamsData = [];
      teamsList.push(resp['data']);
      teamsList.forEach(ele => {
        this.teamsData.push(ele);
      });

      this.addTeamForm.reset();
    this.showToastAfterAddTeam = !this.showToastAfterAddTeam;
    setTimeout(() => {
      this.showToastAfterAddTeam = !this.showToastAfterAddTeam;
    }, 5000);
      
    });
  }

  getFillingTypes(obj){
    let formId = [];
    let selectedFilings = [];
    obj.filingType.forEach(id => {
      formId.push(id);
    });
    formId.forEach((id)=>{
      this.filingType.filter((el)=>{
        el.formId === id ? selectedFilings.push(el): '';
      })
    });
    return selectedFilings;
  }

  getAssignments(selectedFilings){
    let assignments = [];
    selectedFilings.forEach((el)=>{
      let assignmentObj = {
        "entityId": el.formId,
        "entityName": el.filingName
      }
      assignments.push(assignmentObj);
    })
    return assignments;
  }

  closeTeamModal() {
    this.addTeamModal = false;
    this.addTeamForm.reset();
  }

  teamDuplicateCheck(event){
    let teamDupcheck = this.teamsData.findIndex(item => item.teamName.toLowerCase() === event.toLowerCase());
    if(teamDupcheck != -1) {
      this.addTeamForm.controls['teamName'].setErrors({'teamDuplicate': true});
    }
  }

ngOnDestroy() {
  sessionStorage.removeItem("adminTab");
}

public noWhitespaceValidator(control: FormControl) {
  if(control.value) {
    if (control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }
}

openErrorModal(header, description) {
  const dialogRef = this.dialog.open(ErrorModalComponent, {
    disableClose: true,
    width: '400px',
    data: {
      header: header,
      description: description,
      footer: {
        style: "start",
        YesButton: "OK"
      },
    }
  });
  dialogRef.afterClosed().subscribe(result => {

  });
}

exportTeamsData() {
this.exportHeaders = '';
this.exportHeaders = 'teamName:Team  Name,role:Role,numberOfTeamMembers:Members';
this.exportUrl = this.apiHelpers.teams.teams_list+ "?module=" + this.moduleName +  "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
console.log("export URL > ", this.apiHelpers.teams.teams_list+ "?module=" + this.moduleName +  "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv");
this.teamsService.exportTeamsData(this.exportUrl).subscribe(resp => {
  console.log(resp);
})
}

}
