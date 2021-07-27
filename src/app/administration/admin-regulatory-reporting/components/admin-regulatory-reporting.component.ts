import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { ModalComponent } from 'eyc-ui-shared-component';
import { TableHeaderRendererComponent } from './../../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { TeamsService } from './../services/teams.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  
 
  constructor(
    private teamsService: TeamsService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;

  ngOnInit(): void {
    sessionStorage.getItem("adminTab") ?  this.tabIn =  sessionStorage.getItem("adminTab") :  this.tabIn = 1;
    this.getTeamList();
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
    this.teamsService.getTeamsList().subscribe(resp => {
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
        width: 350
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Role',
        field: 'role',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 200
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Assignments',
        field: 'assignments',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Members',
        field: 'members',
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

    const teamsList = this.teamsData;
    this.teamsData = [];
    teamsList.splice(teamsList.findIndex(item => item.teamId === row.teamId),1);
    teamsList.forEach(ele => {
      this.teamsData.push(ele);
    });
    
      this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
      setTimeout(() => {
        this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
      }, 5000);
    }
  });

  
}
editTeams(row) {
  this.router.navigate(['/team-details/' + row.teamId]);
}

ngOnDestroy() {
  sessionStorage.removeItem("adminTab");
}

}
