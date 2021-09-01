import { AfterViewChecked, ChangeDetectorRef, AfterContentChecked, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Component, HostListener} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { timeStamp } from 'console';
import { Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { ModuleLevelPermissionService } from './services/module-level-permission.service';
import { SESSION_ID_TOKEN,SESSION_ACCESS_TOKEN,IS_SURE_FOOT } from './services/settings-helpers';
import {SettingsService} from './services/settings.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked, AfterContentChecked, OnInit {
  title = 'eyc-ServiceEngine-UI';
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
    public moduleLevelPermission: ModuleLevelPermissionService
    ){
    // To hide header and footer from login page
  
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
         this.showHeaderFooter = this.settingsService.isUserLoggedin();
        }
      });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
       this.router.navigate(['home'])
    }
    
    this.moduleLevelPermission.moduleLevelPermisssionDetails.subscribe(res => {
      setTimeout(() => {
        const userEmail = sessionStorage.getItem('userEmail');
      
        if (userEmail.endsWith('ey.com')) {
          console.log('Internal User');
          this.permission.isDataIntake = this.moduleLevelPermission.checkPermission('Data Intake');
          this.permission.isAdmin = this.moduleLevelPermission.checkPermission('Admin');
          this.permission.isRegReporting = this.moduleLevelPermission.checkPermission('Reg Reporting');
          this.permission.isTaxReporting = this.moduleLevelPermission.checkPermission('Tax Reporting');
        }
        else if (userEmail === 'myeyazure.ping0448@eyscetesteu.com' || userEmail === 'myeyazure.ping0445@eyscetesteu.com') {
          console.log('PING User');
          this.permission.isDataIntake = this.moduleLevelPermission.checkPermission('Data Intake');
          this.permission.isAdmin = this.moduleLevelPermission.checkPermission('Admin');
          this.permission.isRegReporting = this.moduleLevelPermission.checkPermission('Reg Reporting');
          this.permission.isTaxReporting = this.moduleLevelPermission.checkPermission('Tax Reporting');
        } else { 
          console.log('external User');
          this.permission.isDataIntake = false;
          this.permission.isAdmin = false;
          this.permission.isRegReporting = this.moduleLevelPermission.checkPermission('Reg Reporting');
          this.permission.isTaxReporting = false;
        }
      }, 100)
      
    });
  }

 
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
    
  }


  ngAfterViewChecked() {

    setTimeout(() => {

      if (this.settingsService.isUserLoggedin()) {
        
      
        const uname = this.oauthservice.getIdentityClaims();
        sessionStorage.setItem("userEmail", uname['unique_name']);
        if (uname) {
          this.userGivenName = uname['given_name'];
          this.loginName = uname['name'];
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
