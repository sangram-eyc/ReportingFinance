import { Injectable } from '@angular/core';
import { userAdminstration } from '@default/helper/api-config-helper';
import { filing } from 'eyc-ui-shared-component';
import { EycRrApiService } from 'projects/eyc-regulatory-reporting/src/lib/services/eyc-rr-api.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateFilingService {

  filingDetails;
  constructor(
    private apiService: EycRrApiService
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
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.get_static_data_details}` + formId);
  }

  updateStaticData(staticData){
    return this.apiService.invokePutAPI(`${userAdminstration.static_data.add_static_data}`,staticData);
  }

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.static_data_stages}${stageType}`)
  }

  getPBIMappingDetails(formId) {
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.pbi_mapping}`+ formId+ '/pbi-mapping');
  }

  getPBIQuestionList() {
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.pbi_question_list}`);
  }

  addPBIMapping(mappingData) {
    return this.apiService.invokePutAPI(`${userAdminstration.static_data.add_pbi_mapping}`, mappingData)
  }

  deleteTeamMember(pbiMappingData) {
    return this.apiService.invokeDeleteAPIBody(`${userAdminstration.static_data.delete_pbi_mapping}`,pbiMappingData);
  }
}
