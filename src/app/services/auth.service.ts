import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'https://fakestoreapi.com/auth/login';

  constructor(private http: HttpClient) {}

  // Login user and get token
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.api, credentials);
  }

  // Save token in local storage (optional)
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout and remove token
  logout() {
    localStorage.removeItem('authToken');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
