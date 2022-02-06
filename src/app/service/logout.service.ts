import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient) { }

  public endSession(token: string, id_token: string): Observable<any> {  
    //return this.http.get<any>(environment.logout + '?client_id=' + environment.sso_api_username + '&post_logout_redirect_uri=' + environment.postLogoutRedirectURL + '&id_token_hint=' + id_token,      
    return this.http.get<any>(environment.logout + '?client_id=' + environment.sso_api_username + '&id_token_hint=' + id_token,
      {
        headers: new HttpHeaders({          
          Authorization: 'Bearer ' + token
        })
      }).pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

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