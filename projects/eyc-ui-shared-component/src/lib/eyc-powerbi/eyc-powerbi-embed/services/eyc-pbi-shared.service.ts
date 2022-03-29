import { Injectable } from '@angular/core';
import {PBI_CONFIG,pbiReportingConfig} from '../../pbi-config/pbi-config-helper';
import {ApiSharedService} from '../../../services/api-shared.service'

@Injectable({
  providedIn: 'root'
})
export class EycPbiSharedService {

  constructor(private apiService: ApiSharedService) { }

  embedToken = (data) => {
    return this.apiService.invokePostAPI(`${pbiReportingConfig.pbi_embeded_token}${data}`);
  }
  authToken = () => {
    return this.apiService.invokePostAPI(`${pbiReportingConfig.pbi_auth_token}`);
  }

  embedUrlDms = (data) => {
    return this.apiService.invokeGetAPINoHeader(`${pbiReportingConfig.pbi_embeded_url_dms}?reportId=${data}`);
  }
  embedTokenDms = (reportId) => {
    return this.apiService.invokePostAPINoHeader(`${pbiReportingConfig.pbi_embeded_token_dms}/${reportId}`);
  }
}
