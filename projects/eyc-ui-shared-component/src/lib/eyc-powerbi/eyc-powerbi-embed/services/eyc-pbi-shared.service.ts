import { Inject, Injectable } from '@angular/core';
import {PBI_CONFIG,pbiReportingConfig, PBI_AUTH_TOKEN_URL, PBI_EMBED_URL} from '../../pbi-config/pbi-config-helper';
import {ApiSharedService} from '../../../services/api-shared.service'
import { InlineSVGModuleForRoot } from '@ey-xd/ng-motif';

@Injectable({
  providedIn: 'root'
})
export class EycPbiSharedService {

  constructor(private apiService: ApiSharedService, @Inject('pbiApiEndPoint') private pbiApiEndPoint) { }

  embedToken = (data) => {
    return this.apiService.invokePostAPI(`${pbiReportingConfig.pbi_embeded_token}${data}`);
  }
  authToken = () => {
    return this.apiService.invokePostAPI(`${pbiReportingConfig.pbi_auth_token}`);
  }

  embedUrlDms = (data) => {
    return this.apiService.invokeGetAPINoHeader(`${this.pbiApiEndPoint+PBI_EMBED_URL}?reportId=${data}`);
  }
  embedTokenDms = (reportId) => {
    return this.apiService.invokeGetAPINoHeader(`${this.pbiApiEndPoint+PBI_AUTH_TOKEN_URL}/${reportId}`);
  }
}
