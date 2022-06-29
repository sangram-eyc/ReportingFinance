import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../../../../../../src/environments/environment';
import { SubmissionService } from '../services/submission.service';
import { AgGridModule } from 'ag-grid-angular';
import { MotifCardModule,MotifIconModule, MotifTableModule, MotifToastModule } from '@ey-xd/ng-motif';



import { SubmissionComponent } from './submission.component';
import * as FileSaver from 'file-saver';


describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;
  let testBedService: SubmissionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmissionComponent ],
      imports: [HttpClientModule, HttpClientTestingModule,  MotifCardModule,
        MotifIconModule,
        MotifToastModule,
        MotifTableModule,
        AgGridModule.withComponents([])],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(SubmissionService)

  }));

  beforeEach(() => {
   
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  

  it('should get xml files list', () => {
    let response: any;
    spyOn(testBedService, 'getXmlFilesList').and.returnValue(of(response))
    component.receiveFilingDetails({filingName: "FormPF", period: "Q3 2021"});
    fixture.detectChanges();
    expect(component.rowData).toEqual(response);
 
  });

  describe('The function onRowSelected ...', () => {
    it(`- should do something`, () => {
      component.onRowSelected('');
      expect(component).toBeTruthy();
    });
  }); 

   it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  }); 

 
    
  it('on approveSelected', async(() => {
    let response = {
      "success": true,
      "message": "1 file(s) have been downloaded",
      "corelationId": null,
      "data": [
        {
          "fileName": "Form PF -GS Q2 2020_919.xml",
          "file": "xyz"
        }
      ],
      "error": null
    };
    component.downloadFilesRes = [
      {
        "fileName": "Form PF -GS Q2 2020_919.xml",
        "file": "xyz"
      }
    ]
    component.selectedRows = [
      {
        "fileId": 1,
        "fileName": "XML File 1"
      }
    ];
    component.filingName = "FormPF"
    component.period = "Q3 2021"
    component.approveSelected();
      spyOn(testBedService, 'downloadXMl').withArgs( [
        {
          "fileId": 1,
          "fileName": "XML File 1"
        }
      ], 'FormPF', 'Q3 2021').and.returnValue(of(response))
      expect(component.downloadFilesRes).toBeDefined();;
  }));

  it('base64ToBlob ', () => {
    let base64 = `PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxjYXRhbG9nPgogICA8Ym9vayBpZD0iYmsxMDEiPgogICAg
    ICA8YXV0aG9yPkdhbWJhcmRlbGxhLCBNYXR0aGV3PC9hdXRob3I+CiAgICAgIDx0aXRsZT5YTUwg
    RGV2ZWxvcGVyJ3MgR3VpZGU8L3RpdGxlPgogICAgICA8Z2VucmU+Q29tcHV0ZXI8L2dlbnJlPgog
    ICAgICA8cHJpY2U+NDQuOTU8L3ByaWNlPgogICAgICA8cHVibGlzaF9kYXRlPjIwMDAtMTAtMDE8
    L3B1Ymxpc2hfZGF0ZT4KICAgICAgPGRlc2NyaXB0aW9uPkFuIGluLWRlcHRoIGxvb2sgYXQgY3Jl
    YXRpbmcgYXBwbGljYXRpb25zIAogICAgICB3aXRoIFhNTC48L2Rlc2NyaXB0aW9uPgogICA8L2Jv
    b2s+CjwvY2F0YWxvZz4=`
    let data =component.base64ToBlob(base64)
    expect(data).toBeTruthy();
  });

});
