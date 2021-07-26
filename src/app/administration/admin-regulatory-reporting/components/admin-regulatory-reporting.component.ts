import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from './../../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { TeamsService } from './../services/teams.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-admin-regulatory-reporting',
  templateUrl: './admin-regulatory-reporting.component.html',
  styleUrls: ['./admin-regulatory-reporting.component.scss']
})
export class AdminRegulatoryReportingComponent implements OnInit {

  tabIn;
  gridApi;
  columnDefs;
  teamsData;
  displayCheckBox: boolean = true;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  
 
  constructor(
    private teamsService: TeamsService,
    private router: Router
  ) { }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;

  ngOnInit(): void {
    this.tabIn = 1;
    this.getTeamList();
  }

  adminTabChange(selectedTab){
   
    this.tabIn = selectedTab;
    if(this.tabIn === 1) {
      this.displayCheckBox = false;
      this.getTeamList();
      setTimeout(() => { 
        this.displayCheckBox = true;
      }, 200);
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
        sortable: false,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 200
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Assignments',
        field: 'assignments',
        sortable: false,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 150
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        headerName: 'Members',
        field: 'members',
        sortable: false,
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
  console.log(row)
}
editTeams(row) {
  this.router.navigate(['/team-details/' + row.teamId]);
}

}
