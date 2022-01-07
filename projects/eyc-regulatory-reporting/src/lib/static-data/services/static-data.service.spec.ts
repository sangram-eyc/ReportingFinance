import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StaticDataService } from './static-data.service';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StaticDataService', () => {
  let service: StaticDataService;
  let eycRrApiServiceStub = {
    invokeGetAPI: () => {
      return of({})
    },
    invokePutAPI: ()=>{
      return of({})
    }
  }

  let eycRrSettingsServiceStub = {
    regReportingFiling:{
      filing_names:'/v2/regreporting/static-data/forms/displayName',
      static_data_stages:'/v2/regreporting/static-data/stages',
      add_static_data:'/v2/regreporting/static-data/form/'
    }
  }
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
    service = TestBed.inject(StaticDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getStaticData method should call api and return response',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let url = '/v2/regreporting/static-data/forms/displayName'
    service.getStaticData();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('getStages method should call api and return response',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockStageType = 'filing'
    let url = '/v2/regreporting/static-data/stages'+mockStageType;
    service.getStages(mockStageType);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('addStaticData method should call api and return response',()=>{
    spyOn(service['apiService'],'invokePutAPI').and.callFake(()=>{
      return of({"success": true})
    });
    let mockStaticData = []
    let url = '/v2/regreporting/static-data/form/'
    service.addStaticData(mockStaticData);
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockStaticData)
  });
});
