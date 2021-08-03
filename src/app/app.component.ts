import { AfterViewChecked, ChangeDetectorRef, AfterContentChecked, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Component, HostListener} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { SESSION_ID_TOKEN,SESSION_ACCESS_TOKEN } from './services/settings-helpers';
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
  @ViewChild('notification', { static: false }) notificationCard: ElementRef;
  @ViewChild('notificationicon', { static: false }) notificationIcon: ElementRef;
  constructor(
    private oauthservice: OAuthService,
    private loaderService: LoaderService, 
    private router: Router,
    private cdRef : ChangeDetectorRef,
    private settingsService: SettingsService){
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
  }

 
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
    
  }


  ngAfterViewChecked() {

    setTimeout(() => {

      if (this.settingsService.isUserLoggedin()) {
        
      
        const uname = this.oauthservice.getIdentityClaims();
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
