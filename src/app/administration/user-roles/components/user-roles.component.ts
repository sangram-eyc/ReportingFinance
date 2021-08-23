import { Component, OnInit } from '@angular/core';
import { UserRolesService } from '../services/user-roles.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  roles = [];
  value = true;
  value1 = true;
  value2 = true;
  constructor(
    private service: UserRolesService
  ) { }

  ngOnInit(): void {
    this.getRolesList();
  }

  getRolesList() {
    this.service.getRolesList().subscribe(res => {
      console.log(res);
      
      this.roles = res['data'];
    });
  }

  onChangePermission(event, permission){
    console.log(event, permission);
    
  }
}
