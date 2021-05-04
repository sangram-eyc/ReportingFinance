// import { Component, OnInit } from '@angular/core';
import { Component, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  constructor(
    private userService: UsersService,
  ) { 
  }

  usersListArr:  any[] = [];

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  columnDefs1;
  rowData;
  
  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild("actionSection")
  actionSection: TemplateRef<any>;

  
  model = '';
  /* motifTypeahead = [
'Alaska',
'California',
'Georgia',
'Kansas',
'Michigan',
'North Carolina',
'South Carolina',
'Virginia',
'West Virginia',
  ]; */
  motifTypeahead = [];


  ngOnInit(): void {
  }

  getUsersData() {
    
    this.userService.getUsersList().subscribe(resp => {
      resp['data'].forEach((item) => {
      const eachitem: any  = {
        name: item.firstName +' '+ item.lastName,
        email: item.userEmail,
        teams: item.userId,
        options: '',
      };
      this.usersListArr.push(eachitem);
      this.rowData = this.usersListArr;
    });

    });

  }

  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.getUsersData();

      this.columnDefs1 = [
        {
          width: 410,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Name',
          field: 'name',
          sortable: true,
          filter: true,
          cellClass: 'custom-user-name',
          // tooltipField: 'name',
          wrapText: true,
          autoHeight: true,
        },
        {
          width: 410,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Email',
          field: 'email',
          cellClass: 'custom-user-email',
          sortable: true,
          filter: true,
          // tooltipField: 'email',
          wrapText: true,
          autoHeight: true,
        },
        {
          width: 90,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Teams',
          field: 'teams',
          sortable: true,
          filter: true,
        },
        {
          width: 80,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: this.editAct.bind(this),
          headerName: "Actions",
          field: "Actions",
          sortable: false,
          filter: false,
        },
      ];

    });
      }

}
