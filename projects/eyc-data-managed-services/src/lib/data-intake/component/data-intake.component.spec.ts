import { InjectionToken } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { datamanagedenvironment } from '../../../../../../src/environments/eyc-data-managed-services/data-managed-environment';
import { DataManagedSettingsService } from '../services/data-managed-settings.service';
import { DataManagedService } from '../services/data-managed.service';
import { EycDataApiService } from '../services/eyc-data-api.service';
import { DataIntakeComponent } from './data-intake.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MotifFormsModule } from '@ey-xd/ng-motif';

describe('DataIntakeComponent', () => {
  let component: DataIntakeComponent;
  let fixture: ComponentFixture<DataIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataIntakeComponent],
      providers: [DataManagedService, DataManagedSettingsService,
        EycDataApiService,
        { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
        { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }],
      imports: [HttpClientTestingModule, MotifFormsModule ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeComponent);
    component = fixture.componentInstance;
    component.ngAfterViewInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date', () => {
    expect(component.formatDate('2021-12-18 09:01:15')).toEqual('12/18/2021');
  });

  it('should change report-tab', () => {
    component.reportTabChange(1);
    expect(component.tabIn).toBe(1);
  });

  it('should change inner-tab', () => {
    component.innerTabChange(1);
    expect(component.innerTabIn).toBe(1);
  });
  
});

