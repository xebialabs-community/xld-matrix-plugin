import { Component } from '@angular/core';
import { Application } from './models/Application';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  selectedApps: String[]

  onFilteredApps(event : String[]) {
    this.selectedApps = []
    this.selectedApps = event
  }

}
