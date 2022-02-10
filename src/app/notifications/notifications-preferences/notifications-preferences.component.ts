import { Component, OnInit } from '@angular/core';
import {PreferencesService} from "@default/services/preferences.service";

@Component({
  selector: 'app-notifications-preferences',
  templateUrl: './notifications-preferences.component.html',
  styleUrls: ['./notifications-preferences.component.scss']
})
export class NotificationsPreferencesComponent implements OnInit {

  public webOpen: boolean;
  public mobileOpen: boolean;
  public emailOpen: boolean;
  public preferences;

  constructor(
    private preferencesService: PreferencesService
  ) { }

  ngOnInit(): void {
    this.preferencesService.emailToRecipient().subscribe(res => {
      alert(res)
    });

    this.preferencesService.getPreferencesTypes().subscribe(res => {
      this.preferences = res;
    });
  }

}
