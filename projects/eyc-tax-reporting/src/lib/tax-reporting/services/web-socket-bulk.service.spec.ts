import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import {WebSocketBulkService} from './web-socket-bulk.service';

describe('ManagementReportsService', () => {
  let service: WebSocketBulkService;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
      add_task: '/collaboration/',
      add_comment: '/comment/',
      upload: '/upload/',
      tasks_list: '/collaboration/',
      update_task_status :'/collaboration/',
      comments_list: '/commentary/',
      delete_tag: '/collaboration/',
      add_tag: '/collaboration/',
      update_priority : '/collaboration/',
      download: '/download/',
      production_cycles_comments_details: '/production-cycles/',
      comments_details: '/production-cycles/',
      comment_expand_details: '/collaboration/'
    }
  }
  let eycTaxReportingApiServiceStub = {
    invokeGetAPI: () => { },
    invokePutAPI: () => { },
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        {provide:EycApiService, useValue: eycTaxReportingApiServiceStub},
        {provide:EycTaxSettingsService, useValue:eycTaxSettingsServiceStub},
      {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
      {provide:"taxProduction",  useValue: taxenvironment.production},
      {provide:"rrproduction",  useValue: environment.production},
      {provide: MatDialogRef, useValue: {} },]
    });
    service = TestBed.inject(WebSocketBulkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});