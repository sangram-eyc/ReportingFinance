import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import {TaxCommentService  } from './tax-comment.service';

describe('ManagementReportsService', () => {
  let service: TaxCommentService ;
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
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
          {provide:EycApiService, useValue:  eycTaxReportingApiServiceStub},
          {provide:EycTaxSettingsService, useValue:eycTaxSettingsServiceStub},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(TaxCommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('addTask method should add task to the service', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.addTask({}, 1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('addComment method should add comment to the service', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.addComment({});
    let url = '/comment/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('uploadFile method should add file to the service', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.uploadFile({});
    let url = '/upload/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('getTasksData method should get the task data', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getTasksData(1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('updateTaskStatus method should update task status data', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.updateTaskStatus(1, {});
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('listComments method should get comments list', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.listComments(1);
    let url = '/commentary/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('deleteTag method should delete tag', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.deleteTag(1,1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('addTag method should add a new tag', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.addTag(1,1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('updatePriority method should update an existing priority', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.updatePriority(1,1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('downloadFile method should download blob file', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.downloadFile({});
    let url = '/download/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('cycleCommentsDetails method should get comment details', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.cycleCommentsDetails(1);
    let url = '/production-cycles/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('getCommentsDetailsPerProductCycle method should get productCycle details', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getCommentsDetailsPerProductCycle(1);
    let url = '/production-cycles/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('getCommentExpandDetails method should get comment details', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getCommentExpandDetails(1);
    let url = '/collaboration/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});