import { Component, OnInit, OnChanges, Input, ElementRef, ViewChild } from '@angular/core';
import * as powerbi from 'powerbi-client';
import * as models from 'powerbi-models';
import {EycPbiService} from '../../services/eyc-pbi.service';
import {PBI_CONFIG, IS_THEME_APPLIED} from '../../config/rr-config-helper';
import * as powerbiTheme from '../../../assets/theme/eyc_theme.json';
@Component({
  selector: 'lib-rr-visualisation',
  templateUrl: './rr-visualisation.component.html',
  styleUrls: ['./rr-visualisation.component.scss']
})
export class RrVisualisationComponent implements OnChanges, OnInit {
  @ViewChild('reportstatic') el: ElementRef;
  @Input() selectedReportId: any;
  @Input() selectedFilling: any;
  @Input() selectedPeriod: any;
  private report: powerbi.Report;
  embedConfig;
  filters = [];
  isReportPresent = false;
  constructor(private powerbiMappingService: EycPbiService) { }

  ngOnInit() {
    console.log(this.selectedReportId, this.selectedFilling, this.selectedPeriod);
 }
  ngOnChanges() {
    console.log(this.selectedReportId, this.selectedFilling, this.selectedPeriod);
    if (this.selectedReportId){
      this.showVisualizationForPowerBi();
    }
  }

  getAuthToken() {
    return this.powerbiMappingService.authToken();
  }

  getEmbedToken(authToken: string) {
    const req: any = {};
    req.reportId = this.selectedReportId;
    return this.powerbiMappingService.embedToken(this.selectedReportId);
  }

  buildConfig(embedUrl: string, reportId: string, workspaceId: string, embedToken: string) {
    const embedConfig = {
      type: 'report',
      embedUrl: embedUrl + '?' + 'reportId=' + reportId + '&groupId=' + workspaceId,
      accessToken: embedToken,
      permissions: models.Permissions.All,
      tokenType: models.TokenType.Embed,
      theme: IS_THEME_APPLIED ? {themeJson: powerbiTheme} : '',
      viewMode: models.ViewMode.View
    };
    return embedConfig;
  }


  setFilter(value) {
    if (!isNaN(value)) {
      value = +value;
    }

    this.report.setFilters(this.filters);
    console.log('Filters', this.filters);
  }


  showVisualizationForPowerBi() {
     this.getAuthToken().subscribe(authTokenData => {
        const authToken = authTokenData['accessToken'];
        sessionStorage.setItem('PBI_AUTH_TOKEN', authToken);
        this.getEmbedToken(authToken).subscribe(embedTokenData => {
          console.log('PowerBI Acceestokn works');
          const embedToken = embedTokenData['token'];
          const embedConfig = this.buildConfig(PBI_CONFIG.PBI_EMBED_URL, this.selectedReportId, PBI_CONFIG.PBI_WORK_SPACE_ID, embedToken);
          const pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory,
                  powerbi.factories.routerFactory);
          pbi.reset(this.el.nativeElement);
          const reportContainer = this.el.nativeElement as HTMLElement;
          this.report = (pbi.embed(reportContainer, embedConfig) as powerbi.Report);
          const self = this;
          const filters = this.selectedPeriod ? this.selectedPeriod.split(' ') : [] ;
          this.report.on('loaded', function(event) {
            self.report.getFilters().then(filters => {
              self.filters = [];
              for (const filter of filters) {
                console.log('Filter', filter);
                if (filter.target['column'] === 'FilingYear') {
                  filter['operator'] = 'In';
                  if (filter.hasOwnProperty('values')) {
                    filter['values'].push(filters[1]);
                  }
                }
                if (filter.target['column'] === 'FilingPeriod') {
                  filter['operator'] = 'In';
                  if (filter.hasOwnProperty('values')) {
                    filter['values'].push(filters[0]);
                  }
                }
                self.filters.push(filter);
              }
              self.setFilter(self.filters);
            });


        });
      }, error => {

        console.log('Embed token is not working', error);


      });
    });
  }



}
