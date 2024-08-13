import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../models/UserDetails';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private baseURL = 'http://localhost:8080';

  private authStatus = new BehaviorSubject<boolean>(false);

  currentAuthStatus$ = this.authStatus.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {
    if (localStorage.getItem('currentUser')) {
      this.authStatus.next(true)
    }
  }

  public login(username: string, password: string): Observable<any> {

    return this.httpClient
      .post(`${this.baseURL}/auth/login`, { username, password })
      .pipe(
        tap((value) => {
          this.authStatus.next(true);
          localStorage.setItem('currentUser', JSON.stringify(value));
        }),
        catchError((error) => {
          console.error(error.message);
          return throwError(() => error);
        })
      );
  }

  public adminLogin(username: string, password: string): Observable<any> {

    return this.httpClient
      .post(`${this.baseURL}/auth/admin-login`, { username, password })
      .pipe(
        tap((value) => {
          this.authStatus.next(true);
          localStorage.setItem('currentUser', JSON.stringify(value));
        }),
        catchError((error) => {
          console.error(error.message);
          return throwError(() => error);
        })
      );
  }

  public getCurrentAuthStatus(): Observable<boolean> {
    return this.currentAuthStatus$;
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    
    this.authStatus.next(false);

    this.router.navigate(['/']);
  }
}
