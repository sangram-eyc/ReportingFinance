import {AfterViewChecked, ChangeDetectorRef, AfterContentChecked, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Component, HostListener} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {OAuthService} from 'angular-oauth2-oidc';
import {Subject} from 'rxjs';
import {LoaderService} from './services/loader.service';
import {ModuleLevelPermissionService} from './services/module-level-permission.service';
import {SESSION_ID_TOKEN, SESSION_ACCESS_TOKEN, IS_SURE_FOOT, HIDE_HOME_PAGE} from './services/settings-helpers';
import {SettingsService} from './services/settings.service';
import {ErrorModalComponent} from 'eyc-ui-shared-component';
import {MatDialog} from '@angular/material/dialog';
import {
  BulkDownloadModalComponent
} from 'projects/eyc-tax-reporting/src/lib/tax-reporting/bulk-download-modal/bulk-download-modal.component';
import {WebSocketBulkService} from 'projects/eyc-tax-reporting/src/lib/tax-reporting/services/web-socket-bulk.service';
import {PreferencesService} from "@default/services/preferences.service";
import {NotificationService} from "@default/services/notification.service";

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
  isNotificationRead = true;
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  is_Sure_Foot = IS_SURE_FOOT;
  hide_home_page = HIDE_HOME_PAGE;
  @ViewChild('notification', {static: false}) notificationCard: ElementRef;
  @ViewChild('notificationicon', {static: false}) notificationIcon: ElementRef;
  permission = {
    isDataIntake: false,
    isTaxReporting: false,
    isAdmin: false,
    isRegReporting: false,
    isDMS: false
  };
  pendingDownloads: any;
  pendingDownloadsNew: any;
  timeoutWarnDownloads;

  constructor(
    private oauthservice: OAuthService,
    private loaderService: LoaderService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private settingsService: SettingsService,
    public moduleLevelPermission: ModuleLevelPermissionService,
    public dialog: MatDialog,
    private preferencesService: PreferencesService,
    private wsBulkService: WebSocketBulkService,
    private notificationService: NotificationService
  ) {
    // To hide header and footer from login page

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.isNotification = false;
          this.showHeaderFooter = this.settingsService.isUserLoggedin();
        }
      });
  }

  checkTimeOut() {
    this.inActivityTime = sessionStorage.getItem('inActivityTime');
    this.timeoutId = setTimeout(() => {
      if (this.settingsService.isUserLoggedin()) {
        this.openErrorModal('Inactivity', 'You will be logged out due to inactivity');
      }
    }, this.inActivityTime);

    this.timeoutWarnDownloads = setTimeout(() => {
      if (sessionStorage.getItem('pendingDownloadsBulk') != null) {
        this.pendingDownloads = JSON.parse(sessionStorage.getItem('pendingDownloadsBulk'));
        if (this.settingsService.isUserLoggedin() && this.pendingDownloads.length > 0) {
          this.openPendingDownloadsTaxModal('Warning', 'A download is in progress and if the session expires while the download is in progress, the download request will not complete.');
        }
      }
    }, (this.inActivityTime - 120000));
  }

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header,
        description,
        footer: {
          style: 'start',
          YesButton: 'OK'
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.settingsService.logoff();
      this.router.navigate(['/eyComply'], {queryParams: {logout: true}});
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
      this.router.navigate(['home']);
    }

    this.moduleLevelPermission.moduleLevelPermisssionDetails.subscribe(res => {
      setTimeout(() => {
        const uname = res;
        sessionStorage.setItem('userEmail', uname.userEmail);

        setTimeout(() => {
          this.preferencesService.emailToRecipient().subscribe(recipient => {
          }, error => {
            this.preferencesService.createRecipient().subscribe(err => {
            });
          });

          this.notificationService.getNotArchivedNotifications(0).subscribe((notifications: any) => {
            notifications.content.forEach(item => {
              if (!item.isRead) {
                this.isNotificationRead = false;
              }
            });
          });
        }, 1000);

        if (uname) {
          this.userGivenName = uname.firstName;
          this.loginName = uname.firstName + ' ' + uname.lastName;
        }
        this.permission.isDataIntake = this.moduleLevelPermission.checkPermission('Data Intake');
        this.permission.isAdmin = this.moduleLevelPermission.checkPermission('Admin');
        this.permission.isRegReporting = this.moduleLevelPermission.checkPermission('Regulatory Reporting');
        this.permission.isTaxReporting = this.moduleLevelPermission.checkPermission('Tax Reporting');
        this.permission.isDMS = this.moduleLevelPermission.checkPermission('Data Managed Services');

      }, 100);

    });

  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();

  }


  ngAfterViewChecked() {
    setTimeout(() => {
      if (this.settingsService.isUserLoggedin()) {
        this.count++;
        if (this.count == 1) {
          this.checkTimeOut();
          // for the warnings and notifications bulk download process of tax-reporting
          this.wsBulkService.connect().subscribe(resp => {
              if (resp.trim() === 'Connection Established') {
                // to open the websocket conection
                this.openConectionBulkWs();
              } else {
                this.bulkDownloadWarnings(resp);
                // Some function for notifications with the object resp
                // end the code for notifications
              }
            },
            err => {
              console.log('ws bulk error', err);
            },
            () => console.log('ws bulk complete'));
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
    sessionStorage.setItem('isNotificationRead', 'true');
    this.isNotificationRead = sessionStorage.getItem('isNotificationRead') === 'true';

    setTimeout(() => {
      this.notifFlag = false;
    }, 1000);
  }

  public navigatetonotifi() {
    this.router.navigateByUrl('/notification');
    this.isNotification = !this.isNotification;

  }

  warningMessage(): void {
    const dialogConfirm = this.dialog.open(BulkDownloadModalComponent, {
      width: '600px',
      height: '280px',
      data: {
        header: 'Warning',
        description: 'The selected files will be compressed into a zip file. You will receive an in-app notification alerting you when the files are ready for download.',
        important: 'Please note that logging out of the application before files are finished processing will cancel this request.',
        question: 'Are you sure want to cancel the request?',
        footer: {
          style: 'start',
          YesButton: 'Yes',
          NoButton: 'No',
          cancelOption: 'true'
        }
      }
    });

    dialogConfirm.beforeClosed().subscribe(result => {
      if (result.button === 'Yes') {
        console.log('YES CLOSED SESSION');
        this.settingsService.logoff();
        this.router.navigate(['/eyComply'], {queryParams: {logout: true}});
      }
    });
  }

  public logoff() {
    if (sessionStorage.getItem('pendingDownloadsBulk') != null) {
      this.pendingDownloads = JSON.parse(sessionStorage.getItem('pendingDownloadsBulk'));
      if (this.settingsService.isUserLoggedin() && this.pendingDownloads.length > 0) {
        this.warningMessage();
      } else {
        this.wsBulkService.closeConection();
        this.settingsService.logoff();
        this.router.navigate(['/eyComply'], {queryParams: {logout: true}});
      }
    } else {
      this.wsBulkService.closeConection();
      this.settingsService.logoff();
      this.router.navigate(['/eyComply'], {queryParams: {logout: true}});
    }
  }

  @HostListener('document:click', ['$event'])
  public outsideClick(event) {
    if (this.notificationCard && !this.notificationCard.nativeElement.contains(event.target) && !this.notificationIcon.nativeElement.contains(event.target)) {
      this.isNotification = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:mousedown', ['$event'])
  public checkUserActivity(event) {
    clearTimeout(this.timeoutId);
    clearTimeout(this.timeoutWarnDownloads);
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
    if (event.data && (typeof event.data === 'string' || event.data instanceof String)) {
      if (event.data.includes('#access_token=')) {
        setTimeout(() => {
          this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
          this.settingsService.setToken(sessionStorage.getItem(SESSION_ACCESS_TOKEN));
        }, 1000);
      }

    }
  }

  openPendingDownloadsTaxModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      width: '400px',
      data: {
        header,
        description,
        footer: {
          style: 'start',
          YesButton: 'OK'
        },
      }
    });
  }

  bulkDownloadWarnings(objectFromServer: string) {
    try {
      const objectFromWs = JSON.parse(objectFromServer);
      const storedNotifications = sessionStorage.getItem('notifications');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      notifications.push(objectFromWs);
      const objectContent = JSON.parse(objectFromWs.request.content);
      const url = objectContent.extraParameters.downloadUrl;

      const fails = Number(objectContent.extraParameters.fails);
      if (fails > 0) {
        const fundsNames = objectContent.extraParameters.failsName;
        this.openPendingDownloadsTaxModal('Error',
          'Some of selected files had errors, so that can\'t be downloaded. Please reload the page and try again the missing file(s) from : ' + fundsNames + '.');
      }
      if (sessionStorage.getItem('pendingDownloadsBulk') != null) {
        const id = objectContent.extraParameters.downloadId;
        this.pendingDownloads = JSON.parse(sessionStorage.getItem('pendingDownloadsBulk'));
        const startDownloading = this.pendingDownloads.find(element => element == id);
        this.pendingDownloadsNew = this.pendingDownloads.filter(item => item != id);
        sessionStorage.setItem('pendingDownloadsBulk', JSON.stringify(this.pendingDownloadsNew));
        console.log('startDownloading->', startDownloading);
        if (startDownloading !== undefined) {
          if (url !== '') {
            window.open(url);
          }
        } else {
          sessionStorage.setItem('notifications', JSON.stringify(notifications));
          this.isNotificationRead = false;
          sessionStorage.setItem('isNotificationRead', 'false');
          this.notificationService.notification.next(notifications);
        }
      } else {
        sessionStorage.setItem('notifications', JSON.stringify(notifications));
        this.isNotificationRead = false;
        sessionStorage.setItem('isNotificationRead', 'false');
        this.notificationService.notification.next(notifications);
      }
    } catch (err) {
      console.log('bulkDownloadWarnings Error ->', err);
    }
  }

  openConectionBulkWs() {
    const timerIdUserEmail = setInterval(() => {
      if (sessionStorage.getItem('userEmail') != null) {
        clearInterval(timerIdUserEmail);
        this.wsBulkService.openConection(sessionStorage.getItem('userEmail'));
      }
    }, 100);
  }
}
