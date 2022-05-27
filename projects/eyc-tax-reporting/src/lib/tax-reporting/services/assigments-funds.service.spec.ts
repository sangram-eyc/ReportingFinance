import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { AssignmentsFundsService } from './assignments-funds.service';

describe('AssignmentsFundsService ', () => {
  let service: AssignmentsFundsService ;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
        list_users_to_add: '/users'
    }
  }
  let eycTaxReportingApiServiceStub = {
    invokeGetAPI: () => { },
    invokePutAPI: () => { },
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
          {provide:EycApiService, useValue:  eycTaxReportingApiServiceStub},
          {provide:EycTaxSettingsService, useValue:eycTaxSettingsServiceStub},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject( AssignmentsFundsService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('listUserToAdd method should call api and fetch exception', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.listUserToAdd();
    let url = '/users';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('addUsersToFund method should call api and fetch exception', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.addUsersToFund(1,{});
    let url = '/users';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});