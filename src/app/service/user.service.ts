import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";
import {BehaviorSubject, map, Observable} from "rxjs";
import {LoginDto} from "../dto/login-dto";
import {AuthenticationResponseDto} from "../dto/authentication-response-dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('access_token'));
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly http:HttpClient) { }

  register(data: User): Observable<void> {
    return this.http.post<void>('http://localhost:8080/auth/register', data);
  }


  login(loginDto: LoginDto): Observable<boolean> {
    return this.http.post<AuthenticationResponseDto>('http://localhost:8080/auth/login', loginDto)
      .pipe(
        map(data => {
          if (data && data.token) {
            localStorage.setItem('user_id', data.userId)
            localStorage.setItem('access_token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role)
            this.isAuthenticatedSubject.next(true);
            return true;
          }
          return false;
        })
      );
  }
}
