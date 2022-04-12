import { Component, OnInit } from '@angular/core';
import { EuropeanFundReportingSettingsService } from '../../services/european-fund-reporting-settings.service';

@Component({
  selector: 'lib-european-fund-reporting',
  templateUrl: './european-fund-reporting.component.html',
  styleUrls: ['./european-fund-reporting.component.scss']
})
export class EuropeanFundReportingComponent implements OnInit {
  urlWamreg_nonprod: string = 'https://fmsp-stg.ey.com/frc/workflow';
  urlWamreg_prod: string = 'https://fmsp-stg.ey.com/frc/workflow';
  current_path: string = window.location.href
  isProduction: boolean;
  constructor() { }

  ngOnInit(): void {}

  redirectURL() {
    let res = this.current_path.indexOf('TRP');
    (res !== -1) ? this.isProduction = true : this.isProduction = false;
   
    if (this.isProduction) {
      console.log('production')
      window.open(this.urlWamreg_prod);
    }
    else {
      window.open(this.urlWamreg_nonprod);
    }
  }

}
