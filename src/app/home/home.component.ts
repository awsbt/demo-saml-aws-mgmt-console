import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  navigateToDashboard(): void {
    window.location.assign(environment.loginURL);
  }

  aws() {
    //window.location.assign(environment.awsConsoleLoginURL);
    window.open(environment.awsConsoleLoginURL,'_blank');
  }

}
