import { AfterViewChecked, ChangeDetectorRef, AfterContentChecked, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Component, HostListener} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { timeStamp } from 'console';
import { Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { ModuleLevelPermissionService } from './services/module-level-permission.service';
import { SESSION_ID_TOKEN,SESSION_ACCESS_TOKEN,IS_SURE_FOOT, HIDE_HOME_PAGE } from './services/settings-helpers';
import {SettingsService} from './services/settings.service';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, AfterContentChecked, OnInit {
  title = 'eyc-ServiceEngine-UI';
  timeoutId;
  count = 0;
  inActivityTime;
  mini = false;
  userGivenName;
  opensubmenu = '';
  showHeaderFooter = true;
  isNotification = false;
  notificationCount = 0;
  loginName;
  notifFlag = false;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  is_Sure_Foot = IS_SURE_FOOT;
  hide_home_page = HIDE_HOME_PAGE;
  @ViewChild('notification', { static: false }) notificationCard: ElementRef;
  @ViewChild('notificationicon', { static: false }) notificationIcon: ElementRef;
  permission = {
    isDataIntake: false,
    isTaxReporting: false,
    isAdmin: false,
    isRegReporting: false
  };
  constructor(
    private oauthservice: OAuthService,
    private loaderService: LoaderService, 
    private router: Router,
    private cdRef : ChangeDetectorRef,
    private settingsService: SettingsService,
    public moduleLevelPermission: ModuleLevelPermissionService,
    public dialog: MatDialog,
    ){
    // To hide header and footer from login page
  
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
         this.showHeaderFooter = this.settingsService.isUserLoggedin();
        }
      });

      
  }

  checkTimeOut() {
    this.inActivityTime = sessionStorage.getItem("inActivityTime");
    this.timeoutId = setTimeout(() => {
      if (this.settingsService.isUserLoggedin()) {
      this.openErrorModal("Inactivity", "You will be logged out due to inactivity");
      }
    }, this.inActivityTime);
  }

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.settingsService.logoff();
      this.router.navigate(['/eyComply'], { queryParams: { logout: true } });
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
       this.router.navigate(['home'])
    }
    
    this.moduleLevelPermission.moduleLevelPermisssionDetails.subscribe(res => {
      setTimeout(() => {
          const uname = res;
          sessionStorage.setItem("userEmail", uname['userEmail']);
          if (uname) {
            this.userGivenName = uname['firstName'];
            this.loginName = uname['firstName'] + ' ' + uname['lastName'];
          }
          this.permission.isDataIntake = this.moduleLevelPermission.checkPermission('Data Intake');
          this.permission.isAdmin = this.moduleLevelPermission.checkPermission('Admin');
          this.permission.isRegReporting = this.moduleLevelPermission.checkPermission('Regulatory Reporting');
          this.permission.isTaxReporting = this.moduleLevelPermission.checkPermission('Tax Reporting');
        
      }, 100)
      
    });
  }

 
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
    
  }


  ngAfterViewChecked() {
    setTimeout(() => {
      if (this.settingsService.isUserLoggedin()) {
        this.count++;
        if(this.count == 1){
          this.checkTimeOut();
        }
        
      }
    }, 0);
  }


  toggleSideNav() {
    if (this.mini) {
      document.getElementById('sidenav').style.width = '286px';
      const mainContainer = document.getElementById('main-container');
      mainContainer.style.marginLeft = '286px';
      mainContainer.style.maxWidth = 'calc(100% - 286px)';
      this.mini = false;
    } else {
      if (this.opensubmenu !== '') {
        const y = document.getElementById(this.opensubmenu);
        y.style.display = 'none';
        this.opensubmenu = '';
      }
      document.getElementById('sidenav').style.width = '56px';
      const mainContainer = document.getElementById('main-container');
      mainContainer.style.marginLeft = '56px';
      mainContainer.style.maxWidth = 'calc(100% - 56px)';
      this.mini = true;
    }
  }

  public notification() {
    
    this.isNotification = !this.isNotification;
    this.notifFlag = true;

    setTimeout(() => {
      this.notifFlag = false; 
    }, 1000);
  }

  public navigatetonotifi() {
    this.router.navigateByUrl('/notification');
    this.isNotification = !this.isNotification;

  }

  public logoff() {
   this.settingsService.logoff();
  //  this.router.navigateByUrl('/logout');
   this.router.navigate(['/eyComply'], { queryParams: { logout: true } });
  }
  @HostListener('document:click', ['$event'])
  public outsideClick(event) {
    // console.log(event);
    // console.log(this.notificationCard)
    if( this.notificationCard && !this.notificationCard.nativeElement.contains(event.target)  && !this.notificationIcon.nativeElement.contains(event.target)){
      this.isNotification = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  public checkUserActivity(event) {
    clearTimeout(this.timeoutId);
    this.checkTimeOut();
  }
 
  

  toggleSubMenu(toggleId) {
    if (this.mini) {
      this.toggleSideNav();
    }
    const x = document.getElementById(toggleId);
    if (toggleId === this.opensubmenu) {
      x.style.display = 'none';
      this.opensubmenu = '';
    } else {
      x.style.display = 'block';
      if (this.opensubmenu !== '') {
        const y = document.getElementById(this.opensubmenu);
        y.style.display = 'none';
      }
      this.opensubmenu = toggleId;
    }
  }

@HostListener('window:message', ['$event'])
onMessage(event) {
  if (event['data'] && (typeof event['data'] === 'string' || event['data']  instanceof String)) {
    if (event['data'].includes('#access_token=')) {
      setTimeout(() => {
        this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
        this.settingsService.setToken(sessionStorage.getItem(SESSION_ACCESS_TOKEN));
      }, 1000);
    }

  }
}
   
}
