import { Injectable } from '@angular/core';
import { Observable, throwError  } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  constructor(private http: HttpClient) { }

  public getUserDetails(token: string): Observable<any> {  
    return this.http.get<any>(environment.detailURL,
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