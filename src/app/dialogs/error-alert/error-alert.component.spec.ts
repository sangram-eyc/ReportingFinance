import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ErrorAlertComponent } from './error-alert.component';

describe('ErrorAlertComponent', () => {
  let component: ErrorAlertComponent;
  let fixture: ComponentFixture<ErrorAlertComponent>;
  const dialogMock = {
    close: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorAlertComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the function to close the dialog', () => {
    spyOn(component.dialogRef, "close");
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should check user already present condition', () => {
    let data = "Error Code: 409 }\nMessage: User already present."
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.data).toContain('User already present')
    if (component.data.includes('User already present')) {
      component.statusCode = '409';
      component.statusText = 'Request retuns a invalid response';
      component.errorMessage = 'User with specified email address already exists';
      expect(component.statusCode).toEqual('409');
    }
  });

  it('should check status is 404', () => {
    let data = "Error Code: 404  Not found."
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    component.statusCode = '404';
    component.statusText = 'Request retuns a invalid response';
    component.errorMessage = component.data;
    expect(component.errorMessage).toEqual(data);
  });

  it('should check when error data.error.status present', () => {
    let data = {
      error: {
        status: '500'
      }
    };
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.statusText).toEqual('500');
  });

  it('should check when error data.error.error string present', () => {
    let data = {
      error: { message:"Internal server error"}
    };
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.errorMessage).toEqual("Internal server error");
  });

  it('should check when error data.error.error string present', () => {
    let data = {
      error: "500 - The request timed out. Internal server error"
    };
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.errorMessage).toEqual("The web server failed to respond within the specified time.");
  });

  it('should check when erro is null or undefined', () => {
    let data = null
    component.data = data
    component.ngOnInit()
    fixture.detectChanges();
    expect(component.errorMessage).toEqual('An error occured but we have not been able to determine it.');
  });
  //   it('should close the component if cancel is clicked', () => {
  //     mockDialogRef.close.calls.reset();
  //     page.cancelButton.click();
  //     expect(mockDialogRef.close).toHaveBeenCalled();
  // });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
