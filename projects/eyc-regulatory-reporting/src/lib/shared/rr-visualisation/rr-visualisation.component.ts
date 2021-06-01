import { Component,OnInit,OnChanges,Input,ElementRef,ViewChild } from '@angular/core';
import * as powerbi from 'powerbi-client';
import * as models from 'powerbi-models';
import {EycPbiService} from '../../services/eyc-pbi.service';
import {PBI_CONFIG} from '../../config/rr-config-helper';

@Component({
  selector: 'lib-rr-visualisation',
  templateUrl: './rr-visualisation.component.html',
  styleUrls: ['./rr-visualisation.component.scss']
})
export class RrVisualisationComponent implements OnChanges,OnInit {
  @ViewChild('reportstatic') el: ElementRef;
  @Input() selectedReportId: any;
  @Input() selectedFilling: any;
  @Input() selectedPeriod: any;
  private report: powerbi.Report;
  embedConfig;
  filters = [];
  constructor(private powerbiMappingService: EycPbiService) { }

  ngOnInit() {
    this.getEmbedToken();
  }
  ngOnChanges() {
    this.getEmbedToken();
  }
 
  
  getEmbedToken() {
    const req: any = {};
    req.groupId = PBI_CONFIG.PBI_WORK_SPACE_ID;
    req.reportId = this.selectedReportId;
    return this.powerbiMappingService.embedToken(req).subscribe(embedToken =>{
      const embedConfig = this.buildConfig(PBI_CONFIG.PBI_EMBED_URL,embedToken['token']);
       this.showVisualizationForPowerBi(embedConfig);
     
    });
  }

  buildConfig(embedUrl: string,embedToken: string) {
    const embedConfig = {
      type: 'report',
      embedUrl: embedUrl + '?' + 'reportId=' + this.selectedReportId + '&groupId=' + PBI_CONFIG.PBI_WORK_SPACE_ID,
      accessToken: embedToken,
      permissions: models.Permissions.All,
      tokenType: models.TokenType.Embed,
      viewMode: models.ViewMode.View
    };
    return embedConfig;
  }

  showVisualizationForPowerBi(embedConfig) {
    const fillingId = this.selectedReportId;
    const period = this.selectedPeriod;
      const pbi = new powerbi.service.Service(powerbi.factories.hpmFactory, powerbi.factories.wpmpFactory,
          powerbi.factories.routerFactory);
        pbi.reset(this.el.nativeElement);
        const reportContainer = <HTMLElement>this.el.nativeElement;
        this.report = <powerbi.Report>pbi.embed(reportContainer,embedConfig);
        const self = this;
        this.report.on('loaded', function (event) {
          self.report.getFilters().then(filters => {
            self.filters = [];
            for (const filter of filters) {
              console.log('Filter', filter);
              if (filter['target']['column'] === 'Filling') {
                filter['operator'] = 'In';
                filter['values'].push(fillingId);
              }
              if (filter['target']['column'] === 'period') {
                filter['operator'] = 'In';
                if (filter.hasOwnProperty('values')) {
                  filter['values'].push(period);
                }
              }
              self.filters.push(filter);
            }
            self.setFilter(self.filters);
          });
        });
  }
  setFilter(value) {
    if (!isNaN(value)) {
      value = +value;
    }

    this.report.setFilters(this.filters);
    console.log('Filters', this.filters);
  }

}
