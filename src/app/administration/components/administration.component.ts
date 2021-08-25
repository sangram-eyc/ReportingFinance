import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {IS_SURE_FOOT} from '../../services/settings-helpers';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

is_Tax_Reporting = IS_SURE_FOOT;
  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  routeAdminRR(){
    this.router.navigate(['/admin-rr-dashboard']);
  }

 

}
