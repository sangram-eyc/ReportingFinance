import { Component, OnInit, OnChanges, Input, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import * as powerbi from 'powerbi-client';
import * as models from 'powerbi-models';
import {EycPbiService} from '../../services/eyc-pbi.service';
import {PBI_CONFIG, IS_THEME_APPLIED,IS_FY_FILTER,IS_PERIOD_FILTER} from '../../config/rr-config-helper';
import powerbiTheme from '../../../assets/theme/eyc_2_theme.json';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import {SESSION_PBI_TOKEN,PBI_ENCRYPTION_KEY} from '../../config/rr-config-helper'
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
  authTokenInfo;
  embedTokenInfo;
  constructor(private powerbiMappingService: EycPbiService,private regSettingsSvc: EycRrSettingsService) { }

  ngOnInit() {
    console.log(this.selectedReportId, this.selectedFilling, this.selectedPeriod);
 }
  ngOnChanges(changes: any) {
    if (this.selectedReportId) {
      this.showVisualizationForPowerBi();
    }
    if (this.selectedReportId && changes['selectedPeriod']) {
      this.showVisualizationForPowerBi();
    }
    console.log("selected report ID > ", this.selectedReportId);
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
    // console.log('Filters', this.filters);
  }


  showVisualizationForPowerBi() {
     this.getAuthToken().subscribe(authTokenData => {
        this.authTokenInfo = authTokenData;
        const authToken =this.authTokenInfo.data.accessToken;
        sessionStorage.setItem(SESSION_PBI_TOKEN,authToken);
      // this.regSettingsSvc.setSessionToken(authToken,SESSION_PBI_TOKEN,PBI_ENCRYPTION_KEY);
        this.getEmbedToken(authToken).subscribe(embedTokenData => {
          console.log('PowerBI Acceestokn works');
          this.embedTokenInfo = embedTokenData;
          console.log('Emebed token > ', this.embedTokenInfo);
          const embedToken = this.embedTokenInfo.data.token;
          const embedConfig = this.buildConfig(PBI_CONFIG.PBI_EMBED_URL, this.selectedReportId, PBI_CONFIG.PBI_WORK_SPACE_ID, embedToken);
          const pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory,
                  powerbi.factories.routerFactory);
          pbi.reset(this.el.nativeElement);
          const reportContainer = this.el.nativeElement as HTMLElement;
          this.report = (pbi.embed(reportContainer, embedConfig) as powerbi.Report);
          const self = this;
          const pbifilters = this.selectedPeriod ? this.selectedPeriod.split(' ') : [] ;
          //this.report.applyTheme({theme:powerbiTheme});
          this.report.on('loaded', function(event) {
            
            self.report.getFilters().then(filters => {
              self.filters = [];
              for (const filter of filters) {
                // console.log('Filter', filter);
                if (filter.target['column'] === 'FilingYear' && IS_FY_FILTER) {
                  filter['operator'] = 'In';
                  if (filter.hasOwnProperty('values')) {
                    filter['values'].push(pbifilters[1]);
                  }
                }
                if (filter.target['column'] === 'FilingPeriod' && IS_PERIOD_FILTER) {
                  filter['operator'] = 'In';
                  if (filter.hasOwnProperty('values')) {
                    filter['values'].push(pbifilters[0]);
                  }
                }
                self.filters.push(filter);
              }
              self.setFilter(self.filters);
            });
          self.report.applyTheme({themeJson:powerbiTheme});

        });
      }, error => {

        console.log('Embed token is not working', error);


      });
    });
  }



}
