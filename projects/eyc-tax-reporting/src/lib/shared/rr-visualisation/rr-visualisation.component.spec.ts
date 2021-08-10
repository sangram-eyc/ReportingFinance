import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { EycPbiService } from '../../services/eyc-pbi.service';
import { _throw } from 'rxjs/observable/throw';
import { RrVisualisationComponent } from './rr-visualisation.component';
describe('RrVisualisationComponent', () => {
  let component: RrVisualisationComponent;
  let fixture: ComponentFixture<RrVisualisationComponent>;
  let pbiService: EycPbiService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RrVisualisationComponent],
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    })
    .compileComponents();
    pbiService = TestBed.get(EycPbiService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RrVisualisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges', () => {
    component.selectedReportId ="sfsdfsdfsfsdfsdf"
    let mySpy = spyOn(component,'showVisualizationForPowerBi').and.callThrough()
    component.ngOnChanges({selectedReportId:"sfsdfsdfsfsdfsdf"})

    fixture.detectChanges();

    expect(mySpy).toHaveBeenCalled();
  });

  it(' getAuthToken', () => {
    component.getAuthToken()
    expect(component.getAuthToken).toBeTruthy();
  });

  it(' getEmbedToken', () => {
    component.getEmbedToken("sdfsdfsdf")
    expect(component.getEmbedToken).toBeTruthy();
  });

  // it(' setFilter', () => {
  //   component.setFilter("abc")
  //   component.filters = [{abc:"abc"}]
  //   expect(component).toBeTruthy();
  // });

  it(' showVisualizationForPowerBi', () => {
    let authTokenData = {
      accessToken: "sdfsdfsfsdfsdfgsdvrsdf"
    };
    let embedTokenData = {
      token:"fvervdfgdfdfvdfv"
    };
    spyOn(component, 'getAuthToken').and.returnValue(of(authTokenData));
    const authToken = authTokenData['accessToken'];
    spyOn(component, 'getEmbedToken').and.returnValue(of(embedTokenData));
    const embedToken = embedTokenData['token'];
    component.showVisualizationForPowerBi();
    expect(authToken).toBeTruthy();
    expect(embedToken).toBeTruthy();
  });

});
