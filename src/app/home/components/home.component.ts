import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {SESSION_ID_TOKEN} from '../../services/settings-helpers';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
      this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
    }
  }

}
