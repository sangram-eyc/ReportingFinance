import { Component,HostListener,ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {SettingsService} from './services/settings.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eyc-ServiceEngine-UI';
  mini = false;
  opensubmenu = '';
  showHeaderFooter: boolean = true;
  isNotification = false;
  notificationCount =0;
  constructor(private router:Router,private settingsService: SettingsService,private elementRef:ElementRef){
    // To hide header and footer from login page
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
         // this.showHeaderFooter = !(this.router.url === '/login')
         this.showHeaderFooter = this.settingsService.isUserLoggedin();
        
        }
      });

  }
  

  toggleSideNav() {
    if (this.mini) {
      document.getElementById("sidenav").style.width = "286px";
      let mainContainer = document.getElementById("main-container");
      mainContainer.style.marginLeft = "286px";
      mainContainer.style.maxWidth = "calc(100% - 286px)";
      this.mini = false;
    } else {
      if (this.opensubmenu !== '') {
        let y = document.getElementById(this.opensubmenu);
        y.style.display = 'none';
        this.opensubmenu = '';
      }
      document.getElementById("sidenav").style.width = "56px";
      let mainContainer = document.getElementById("main-container");
      mainContainer.style.marginLeft = "56px";
      mainContainer.style.maxWidth = "calc(100% - 56px)";
      this.mini = true;
    }
  }

  public notification() {
    this.isNotification = !this.isNotification;
  }

  public navigatetonotifi() {
    this.router.navigateByUrl('/notification');
    this.isNotification = !this.isNotification;

  }

  public logoff() {
   this.settingsService.logoff();
  //  this.router.navigateByUrl('/logout');
  this.router.navigate(['/eyComply'], { queryParams: { logout: true } })
  }
  @HostListener('document:click',['$event'])
  public outsideClick() {
    const elementId = (event.target as Element).id;
    const elementName = (event.target as Element).nodeName;
    if (elementId.includes("notifcationcontainer") || elementId.includes("main-container") || elementId === " " || elementName !=="svg" ) {
      this.isNotification = false;
     
    }
    
  }

  

  toggleSubMenu(toggleId) {
    if (this.mini) {
      this.toggleSideNav();
    }
    let x = document.getElementById(toggleId);
    if (toggleId === this.opensubmenu) {
      x.style.display = 'none';
      this.opensubmenu = '';
    } else {
      x.style.display = 'block';
      if (this.opensubmenu !== '') {
        let y = document.getElementById(this.opensubmenu);
        y.style.display = 'none'
      }
      this.opensubmenu = toggleId;
    }
  }
}
