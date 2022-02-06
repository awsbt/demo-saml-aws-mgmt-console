import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, finalize, catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AwsCognitoService } from '../service/aws-cognito.service';


@Injectable()
export class TokenResolverService implements Resolve<any> {

  constructor(private location: Location,
              private awsCognitoService: AwsCognitoService,
              private router: Router) { }

  resolve(): Observable<any | null> {
    //console.log('window.location.search=', window.location.search);
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const code: string = urlParams.get('code');
    //console.log('in resolve() code=', code);
    if (!code) {
      //console.log('in resolve() code is null code=', code);
      return of(null);
    }
    //console.log('in resolve() code not null code=', code);
    return this.getTokenDetailsFromCognito(code).pipe(
      finalize(() => {
        this.location.replaceState(window.location.pathname);
      })
    );
  }

  getTokenDetailsFromCognito(code: string): Observable<any | null> {
    return this.awsCognitoService.getTokenDetailsFromCognito(code).pipe(
      switchMap((response: any) => {
        //console.log('Response: ', response);
        localStorage.setItem('code', code);
        localStorage.setItem('id_token', response.id_token);
        localStorage.setItem('token', response.access_token);

        if (response) {
          this.router.navigate(['dashboard']);
        }

        return of(response);
      }),
      catchError ((error) => {
        return error;
      })
    );
  }
}
