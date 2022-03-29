import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, ElementRef, OnChanges } from '@angular/core';
import * as powerbi from 'powerbi-client';
import * as models from 'powerbi-models';
import { EycPbiSharedService } from '../eyc-powerbi-embed/services/eyc-pbi-shared.service'
import * as powerbiTheme from '../pbi-config/theme/eyc_2_theme.json';
import { SESSION_PBI_TOKEN, PBI_ENCRYPTION_KEY, PBI_CONFIG, IS_THEME_APPLIED, IS_FY_FILTER, IS_PERIOD_FILTER } from '../pbi-config/pbi-config-helper';
import { IReportEmbedConfiguration } from 'powerbi-client';
@Component({
  selector: 'lib-power-bi-paginated-report-embed',
  templateUrl: './power-bi-paginated-report-embed.component.html',
  styleUrls: ['./power-bi-paginated-report-embed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerBiPaginatedReportEmbedComponent implements OnInit,OnChanges {
  @ViewChild('reportstatic') el: ElementRef;
  @Input() selectedReportId: any;
  @Input() selectedFilling: any;
  @Input() selectedPeriod: any;
  @Input() selectedDate: any;
  @Input() pod: any;
  private report: powerbi.Report;
  embedConfig;
  filters = [];
  pbi;
  isReportPresent = false;

  reportConfig: IReportEmbedConfiguration = {
    type: 'report',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
    settings: undefined,
  };

  constructor(private powerbiMappingService: EycPbiSharedService) {
     this.pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory,
      powerbi.factories.routerFactory);
   }

  ngOnInit() {
    console.log(this.selectedReportId, this.selectedFilling, this.selectedPeriod, this.selectedDate);
  }

  ngOnChanges(changes: any) {
    if (!!this.selectedReportId) {
      this.showVisualizationForPowerBi();
    }
    else if(this.selectedReportId=='xyz'){
      this.pbi.reset(this.el.nativeElement);
    }
    console.log("selected report ID > ", this.selectedReportId);
  }

  getEmbedToken() {
    return this.pod=="DMS"? this.powerbiMappingService.embedTokenDms(this.selectedReportId) : this.powerbiMappingService.authToken();

  }

  getEmbedUrl() {
    const req: any = {};
    req.reportId = this.selectedReportId;
    return this.pod=="DMS"? this.powerbiMappingService.embedUrlDms(this.selectedReportId):this.powerbiMappingService.embedToken(this.selectedReportId);
  }

  buildConfig(embedUrl: string, reportId: string, workspaceId: string, embedToken: string) {
    const embedConfig = {
      type: 'report',
      embedUrl: embedUrl + '?' + 'reportId=' + reportId + '&groupId=' + workspaceId,
      accessToken: embedToken,
      permissions: models.Permissions.All,
      tokenType: models.TokenType.Embed,
      theme: IS_THEME_APPLIED ? { themeJson: powerbiTheme } : '',
      viewMode: models.ViewMode.View
    };
    return embedConfig;
  }

  setFilter(value) {
    if (!isNaN(value)) {
      value = +value;
    }
    this.report.setFilters(this.filters);
  }

  showVisualizationForPowerBi() {
    this.getEmbedToken().subscribe(embedTokenRes => {
      console.log('DMS PowerBI embedToken works');
      const embedToken = embedTokenRes['data']['token'];
      sessionStorage.setItem(SESSION_PBI_TOKEN, embedToken);
      // this.regSettingsSvc.setSessionToken(authToken,SESSION_PBI_TOKEN,PBI_ENCRYPTION_KEY);
      this.getEmbedUrl().subscribe(embedTokenData => {
        console.log('DMS PowerBI embedUrl works');
        const embedUrl = embedTokenData['data']['embedUrl'];
        //  const embedConfig = this.buildConfig(PBI_CONFIG.PBI_EMBED_URL, this.selectedReportId, PBI_CONFIG.PBI_WORK_SPACE_ID, embedToken);
        // const pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory,
        //   powerbi.factories.routerFactory);
        this.pbi.reset(this.el.nativeElement);
        const reportContainer = this.el.nativeElement as HTMLElement;
        this.reportConfig = {
          ...this.reportConfig,
          id: this.selectedReportId,
          embedUrl: embedUrl,
          accessToken: embedToken,
        };
        this.report = (this.pbi.embed(reportContainer, this.reportConfig) as powerbi.Report);
        const self = this;
        const pbifilters = this.selectedPeriod ? this.selectedPeriod.split(' ') : [];

        this.report.on('loaded', function (event) {
          console.log("Report Data", self.report);
          console.log("Get Filters", self.report.getFilters());
          self.report.getFilters().then(filters => {
            console.log("Number of filters defined in PBI", filters);
            self.filters = [];
            for (const filter of filters) {
              console.log('Filter', filter);
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

              if (filter.target['column'] === 'period end date') {
                filter['operator'] = 'In';
                if (filter.hasOwnProperty('values')) {
                  filter['values'].push(this.selectedDate);
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
