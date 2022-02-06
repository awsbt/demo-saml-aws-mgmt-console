import { Component, OnInit } from '@angular/core';
import { AwsCognitoService } from '../service/aws-cognito.service';
import { UserDetailService } from '../service/user-detail.service';
import { LogoutService } from '../service/logout.service';
import { IdentityService } from '../service/identity.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, finalize, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tokenDetails: any;
  token: any;
  result: any;
  id_token: any;
  code: any;

  constructor(private userDetailService: UserDetailService, private logoutService: LogoutService,
    private identityService: IdentityService, private http: HttpClient) { }

  ngOnInit(): void {
    //console.log('Token: ', localStorage.getItem('token'));
    //console.log('Id Token: ', localStorage.getItem('id_token'));
    this.id_token = localStorage.getItem('id_token');
    this.token = localStorage.getItem('token');
  }

  detail() {
    this.token = localStorage.getItem('token');    
    this.userDetailService.getUserDetails(this.token).subscribe(data => {
      console.log('user info: ' + JSON.stringify(data));
    })
  }

  accessToken() {
    this.token = localStorage.getItem('token');
    console.log('Access Token Detail: ', this.token);
  }

  idToken() {
    this.id_token = localStorage.getItem('id_token');
    if (this.id_token) {
      const base64Url = this.id_token.split('.')[1];      
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      this.tokenDetails = JSON.parse(atob(base64));

      console.log('ID Token Detail: ', this.tokenDetails);    
    }
  }

  codeDetail() {
    this.code = localStorage.getItem('code');
    console.log('CODE Detail: ', this.code);
  }

  aws() {
    //window.location.assign(environment.awsConsoleLoginURL);
    window.open(environment.awsConsoleLoginURL,'_blank');
  }

  getId() {  
    console.log('Calling get identity');
    this.id_token = localStorage.getItem('id_token');  
     this.identityService.getIdentityFromCognito(this.id_token).subscribe
      ((response: any) => {
      console.log('Response: ', response);
    })      
  }

  logout(): void {
    this.token = localStorage.getItem('token');    
    this.id_token = localStorage.getItem('id_token');  
    this.logoutService.endSession(this.token, this.id_token).subscribe(data => {
      window.location.assign(environment.postLogoutRedirectURL);
    })        
  }

}