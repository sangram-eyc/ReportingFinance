import { Injectable } from '@angular/core';
import { filing } from 'eyc-ui-shared-component';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateFilingService {

  filingDetails;
  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  set setData(data) {
    this.filingDetails = data;
  }

  get getData() {
    return this.filingDetails;
  }

  editFiling(data) {
    
  }

  getFilingDetails(formId) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.get_static_data_details}` + formId);
  }

  updateStaticData(staticData){
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.add_static_data}`,staticData);
  }

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.static_data_stages}${stageType}`)
  }

  getPBIMappingDetails(formId) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.pbi_mapping}`+ formId+ '/pbi-mapping');
  }

  getPBIQuestionList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.pbi_question_list}`);
  }

  addPBIMapping(mappingData) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.add_pbi_mapping}`, mappingData)
  }
}
