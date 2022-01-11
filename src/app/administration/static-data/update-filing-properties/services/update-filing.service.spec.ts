import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EycRrApiService } from 'projects/eyc-regulatory-reporting/src/lib/services/eyc-rr-api.service';
import { EycRrSettingsService } from 'projects/eyc-regulatory-reporting/src/lib/services/eyc-rr-settings.service';
import { of } from 'rxjs';

import { UpdateFilingService } from './update-filing.service';

describe('UpdateFilingService', () => {
  let service: UpdateFilingService;
  let eycRrApiServiceStub = {
    invokeGetAPI: () => {
      return of({})
    },
    invokePutAPI: ()=>{
      return of({})
    }
  }

  let eycRrSettingsServiceStub = {}
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule
      ],
      providers: [
        { provide: EycRrApiService, useValue: eycRrApiServiceStub },
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub }

      ]
    });
    service = TestBed.inject(UpdateFilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getFilingDetails method should fetch filing details ',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockFormId = 101;
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/form/101'
    service.getFilingDetails(mockFormId);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('updateStaticData method should update static data ',()=>{
    spyOn(service['apiService'],'invokePutAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockStaticData = []
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/stages'
    service.updateStaticData(mockStaticData);
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockStaticData)
  });

  it('getStages method should fetch stages ',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockStageType = 'filing'
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/stages/'+mockStageType;
    service.getStages(mockStageType);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('getPBIMappingDetails method should fetch PBI mapping details ',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockFormId = 101;
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/form/101/pbi-mapping';
    service.getPBIMappingDetails(mockFormId);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('getPBIQuestionList method should fetch PBi QuestionsList ',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/questions';
    service.getPBIQuestionList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('addPBIMapping method should add PBI ',()=>{
    spyOn(service['apiService'],'invokePutAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockPBIData = []
    let url = 'https://10.48.234.20/qa32/gatewayService/api/v2/regreporting/static-data/pbi-mapping'
    service.addPBIMapping(mockPBIData);
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockPBIData)
  });
});
