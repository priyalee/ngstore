// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private api = 'https://fakestoreapi.com/carts';

  constructor(private http: HttpClient) {}

  // Get all carts
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // Get cart by ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // Add new cart
  add(cart: any): Observable<any> {
    return this.http.post<any>(this.api, cart);
  }

  // Update cart
  update(id: number, cart: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, cart);
  }

  // Delete cart
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
