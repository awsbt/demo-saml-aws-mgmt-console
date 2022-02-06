import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private http: HttpClient) { }

  public getIdentityFromCognito(id_token: string): Observable<any> {
    // const details = {
    //   grant_type: 'authorization_code',
    //   code: callbackCode,
    //   redirect_uri: environment.redirectURL
    // };
     const logins = {
         'ad7bec1a5d4a448ffb3673fc9a150873-aea79b9aae3a10f6.elb.us-gov-east-1.amazonaws.com/am/oauth2'  : id_token        
       };
          
     const details = {
       IdentityPoolId : environment.identityPoolId,
       Logins : logins
     };
    const formBody = Object.keys(details)
                           .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`)
                           .join('&');
    //console.log('in getTokenDetailsFromCognito() code=', callbackCode);
    return this.http.post<any>(environment.cognitoUrl,
        details, {
        headers: new HttpHeaders({
            'Content-Type' : 'application/x-amz-json-1.1',
            'x-amz-target' : 'AWSCognitoIdentityService.GetId'
          })
        });
  }

//   public getIdentityFromCognito(id_token: string): Observable<any> {
//     const logins = {
//         'ad7bec1a5d4a448ffb3673fc9a150873-aea79b9aae3a10f6.elb.us-gov-east-1.amazonaws.com/am/oauth2'  : id_token        
//       };

//     const details = {
//       IdentityPoolId : environment.identityPoolId,
//       Logins : logins
//     };

//     const formBody = Object.keys(details)
//                            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(details[key])}`)
//                            .join('&');

//     return this.http.post<any>(environment.cognitoUrl,
//         details, {    
//         headers: new HttpHeaders({
//           'Content-Type' : 'application/x-amz-json-1.1',
//           'x-amz-target' : 'AWSCognitoIdentityService.GetId'
//           })
//         }).pipe(
//             retry(1),
//             catchError(this.handleError)
//           );
//   }

  // Error handling 
  handleError(error: any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
}