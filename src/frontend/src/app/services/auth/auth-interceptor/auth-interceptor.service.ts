import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, take, switchMap} from "rxjs/operators";
import { AuthDataSharingService } from '../user-data-sharing';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(
    private authDataSharingService : AuthDataSharingService
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
      const token = localStorage.getItem('auth_token')

      if (token != null && !this.isTokenExpired(token)){
        req = req.clone({
          setHeaders: {
            authorization: `Bearer ${token}`
          }
        })
      } else{
        //Set token expired
        //this.authDataSharingService.isUserLoggedIn.next(false)
      }

      //req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      //req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

      return next.handle(req)
      .pipe(
        catchError((error : HttpErrorResponse) => {
          if(error && error.status === 401){
            console.log("ERROR 401 UNAUTHORIZED")
            this.authDataSharingService.isUserLoggedIn.next(false)
          }
          const err = error.error.message || error.statusText
          return throwError(error)
        })
      )
  }

  private isTokenExpired(token : string) : boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
