import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../../../../../../src/environments/environment';
import { SubmissionService } from '../services/submission.service';

import { SubmissionComponent } from './submission.component';
import * as FileSaver from 'file-saver';

describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;
  let testBedService: SubmissionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionComponent ],
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(SubmissionService)
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('should check the service', () => {
    expect(testBedService instanceof SubmissionService).toBeTruthy();
  }); */

  it('should get xml files list', () => {
    let response: any;
    spyOn(testBedService, 'getXmlFilesList').and.returnValue(of(response))
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.rowData).toEqual(response);

  }); 

  it('on row selected', () => {
    let respose = [];
    component.onRowSelected;
    fixture.detectChanges();
    expect(component.selectedRows).toEqual(respose);
  });




  

  it('on approveSelected', async(()=> {
    component.approveSelected();
    fixture.detectChanges();
    component.selectedRows = [
      {
          "fileId": 1,
          "fileName": "XML File 1"
      },
      {
          "fileId": 2,
          "fileName": "XML File 2"
      },
      {
          "fileId": 3,
          "fileName": "XML File 3"
      }
  ];
        component.selectedRows.forEach((item) => {
          
          // testBedService.downloadXMl(item.fileId).subscribe((res: any) => {
            // FileSaver.saveAs(res.body, item.fileName + '.xml');
        // });

        });

  }));

});
