import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {IS_SURE_FOOT} from '../../services/settings-helpers';
import { AdministrationService } from '../services/administration.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

is_Tax_Reporting = IS_SURE_FOOT;
  constructor(
    private router: Router,
    private service: AdministrationService
  ) { }

  ngOnInit(): void {
  }

  routeAdminRR(){
    this.service.module = 'Regulatory Reporting';
    this.router.navigate(['/admin-rr-dashboard']);
  }


  routeAdmin(module) {
    //should use this generic method for future modules
    this.service.setCurrentModule = module;
    this.router.navigate(['/admin-rr-dashboard']);
  }

 

}
