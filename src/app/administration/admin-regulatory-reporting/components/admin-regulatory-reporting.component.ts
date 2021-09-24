import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { TableHeaderRendererComponent } from './../../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { TeamsService } from './../services/teams.service';
import {Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { customComparator } from 'eyc-ui-shared-component';
import { AdministrationService } from '@default/administration/services/administration.service';

import {IS_SURE_FOOT} from '../../../services/settings-helpers';
@Component({
  selector: 'app-admin-regulatory-reporting',
  templateUrl: './admin-regulatory-reporting.component.html',
  styleUrls: ['./admin-regulatory-reporting.component.scss']
})
export class AdminRegulatoryReportingComponent implements OnInit, OnDestroy {

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
  assignments = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6']
  showToastAfterAddTeam = false;
  is_Tax_Reporting = IS_SURE_FOOT;
  moduleName;
  moduleId;
  constructor(
    private teamsService: TeamsService,
    private adminService: AdministrationService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    const module = adminService.getCurrentModule;
    this.moduleName = module.moduleName;
    this.moduleId = module.moduleId; 
    console.log('Current Module: ', module);
  }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;

  ngOnInit(): void {
    if (!this.is_Tax_Reporting) {
      sessionStorage.getItem("adminTab") ? this.tabIn = sessionStorage.getItem("adminTab") : this.tabIn = 1;
    }
    else {
      this.tabIn = 2;
    }
   
    this.getTeamList();
    this.teamsService.getRoles(this.moduleName).subscribe(resp => {
      this.roles = resp['data'];
    })

    this.addTeamForm = this._createTeam()
  }

  private _createTeam () {
    return this.fb.group({
      teamName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 \-\]+$'), this.noWhitespaceValidator]],
      role: ['', [Validators.required]],
      // assignments: [''],
      description: ['', [Validators.maxLength(250)]]
    });
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

  getTeamList() {
    this.teamsService.getTeamsList(this.moduleName).subscribe(resp => {
        this.teamsData = resp.data;
      });
    this.createTeamsRowData();
  }

  
  createTeamsRowData(): void {
   
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
        comparator: customComparator
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
        sort: 'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Assignments',
        field: 'numberOfAssignments',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 150,
        
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Members',
        field: 'numberOfTeamMembers',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 150
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
    this.addTeamModal = false
    // below code will change after api integration
    
    const team = {
      "teamName": obj.teamName,
      "roleName": obj.role,
      "teamDescription": escape(obj.description),
      "moduleName": this.moduleName,
      // "assignments": obj.assignments
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

  closeTeamModal() {
    this.addTeamModal = false;
    this.addTeamForm.reset();
  }

  teamDuplicateCheck(event){
    let teamDupcheck = this.teamsData.findIndex(item => item.teamName === event);
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
}
