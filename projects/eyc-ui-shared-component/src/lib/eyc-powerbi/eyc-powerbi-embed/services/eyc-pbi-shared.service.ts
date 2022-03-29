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

  embedUrlDms = (baseURL,data) => {
    return this.apiService.invokeGetAPINoHeader(`${baseURL}?reportId=${data}`);
  }
  embedTokenDms = (baseURL,reportId) => {
    return this.apiService.invokeGetAPINoHeader(`${baseURL}/${reportId}`);
  }
}
