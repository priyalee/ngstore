// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://fakestoreapi.com/carts';

  /* UI CART */

  private uiCart: any[] = [];
  private uiCart$ = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  addToUiCart(product: any): void {
    const existing = this.uiCart.find(p => p.id === product.id);

    if (existing) {
      existing.quantity += product.quantity;
    } else {
      this.uiCart.push({ ...product });
    }

    this.uiCart$.next(this.uiCart);
  }

  getUiCart(): Observable<any[]> {
    return this.uiCart$.asObservable();
  }

  clearUiCart(): void {
    this.uiCart = [];
    this.uiCart$.next([]);
  }

  /* API CART */

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  add(cartPayload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cartPayload);
  }

  update(id: number, cartPayload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cartPayload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /* ================= UI → API SYNC ================= */

  syncUiCartToApi(userId = 5): Observable<any> {
    const payload = {
      userId,
      date: new Date().toISOString().split('T')[0],
      products: this.uiCart.map(p => ({
        productId: p.id,
        quantity: p.quantity
      }))
    };

    return this.add(payload);
  }
}
