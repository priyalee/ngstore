import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = 'https://fakestoreapi.com/users';

  constructor(private http: HttpClient) {}

  // Get all users
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // Get single user by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // Add a new user
  add(user: any): Observable<any> {
    return this.http.post<any>(this.api, user);
  }

  // Update an existing user
  update(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, userData);
  }

  //  Delete a user
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
