import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiSharedService } from './api-shared.service';

import { EycRrCommentApiService } from './eyc-rr-comment-api.service';
import { SettingService } from './setting.service';

describe('EycRrCommentApiService', () => {
  let service: EycRrCommentApiService;
  let settingsServiceStub = {
    regReportingFiling : {
      add_comment : '/add-comment',
      upload:'/upload',
      download:'/download',
      list_comments:'/list-comments/',
      resolve:'/resolve/'
    }
  };
  let apiServiceStub = {
    invokePostAPI : ()=>{},
    invokeGetAPI :()=>{}
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: SettingService, useValue: settingsServiceStub },
        { provide: ApiSharedService, useValue: apiServiceStub }]
    });
    service = TestBed.inject(EycRrCommentApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('addComment method should add comment',()=>{
    let mockData = {
      entityId :'101'
    }
    spyOn(service['apiService'],'invokePostAPI');
    service.addComment(mockData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith('/add-comment',mockData)
  })

  it('uploadFile method should add comment',()=>{
    let mockData = {
      entityId :'101'
    }
    spyOn(service['apiService'],'invokePostAPI');
    service.uploadFile(mockData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith('/upload',mockData)
  })

  it('downloadFile method should add comment',()=>{
    let mockData = {
      entityId :'101'
    }
    spyOn(service['apiService'],'invokePostAPI');
    service.downloadFile(mockData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith('/download',mockData)
  })

  it('listComments method should add comment',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    let mockUrl = "/list-comments/tax/101/comments"
    service.listComments('101','tax','');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(mockUrl)
  })

  it('updateStatus method should add comment',()=>{
    let mockData = {
      entityId :'333'
    }
    spyOn(service['apiService'],'invokePutAPI');
    service.updateStatus('101',mockData,'');
    let mockUrl = "/resolve/101/resolve"
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(mockUrl,mockData)
  })
});
