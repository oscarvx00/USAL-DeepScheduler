import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, filter, take, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('auth_token')

      if (token != null){
        req = req.clone({
          setHeaders: {
            authorization: `Bearer ${token}`
          }
        })
      }

      //req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      //req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

      return next.handle(req)
      /*.pipe(
        catchError((error : HttpErrorResponse) => {
          if(error && error.status === 401){
            console.log("ERROR 401 UNAUTHORIZED")
          }
          const err = error.error.message || error.statusText
          return throwError(error)
        })
      )*/
  }
}
