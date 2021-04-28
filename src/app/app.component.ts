import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
  constructor(private router:Router){
    // To hide header and footer from login page
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          this.showHeaderFooter = !(this.router.url === '/login')
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
