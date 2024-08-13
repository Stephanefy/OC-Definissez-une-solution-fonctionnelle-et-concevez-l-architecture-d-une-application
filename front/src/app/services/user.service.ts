import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { 

  }

  getSupportDetails(): Observable<any>{
    return this.httpClient.get('http://localhost:8080/chat/users/support-details')
}
}
