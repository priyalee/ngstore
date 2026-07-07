// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category?: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'https://fakestoreapi.com/carts';
  private readonly storageKey = 'ngstore-cart';

  /* ---------------- UI CART (the user's real cart) ---------------- */

  private uiCart: CartItem[] = this.readStored();
  private uiCart$ = new BehaviorSubject<CartItem[]>(this.uiCart);

  /** Total number of units in the cart (for the navbar badge). */
  count$ = this.uiCart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  /** Cart subtotal in currency units. */
  subtotal$ = this.uiCart$.pipe(
    map(items => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  constructor(private http: HttpClient) {}

  private readStored(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private persist(): void {
    this.uiCart$.next([...this.uiCart]);
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.uiCart)); } catch {}
  }

  addToUiCart(product: any, qty: number = 1): void {
    const existing = this.uiCart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.uiCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: qty
      });
    }
    this.persist();
  }

  setQuantity(id: number, quantity: number): void {
    const item = this.uiCart.find(p => p.id === id);
    if (!item) return;
    item.quantity = Math.max(1, quantity);
    this.persist();
  }

  increment(id: number): void {
    const item = this.uiCart.find(p => p.id === id);
    if (item) { item.quantity++; this.persist(); }
  }

  decrement(id: number): void {
    const item = this.uiCart.find(p => p.id === id);
    if (item && item.quantity > 1) { item.quantity--; this.persist(); }
  }

  removeFromUiCart(id: number): void {
    this.uiCart = this.uiCart.filter(p => p.id !== id);
    this.persist();
  }

  getUiCart(): Observable<CartItem[]> {
    return this.uiCart$.asObservable();
  }

  snapshot(): CartItem[] {
    return [...this.uiCart];
  }

  clearUiCart(): void {
    this.uiCart = [];
    this.persist();
  }

  /* ---------------- FakeStore API (kept intact) ---------------- */

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

  /* ---------------- UI -> API sync ---------------- */

  syncUiCartToApi(userId = 5): Observable<any> {
    const payload = {
      userId,
      date: new Date().toISOString().split('T')[0],
      products: this.uiCart.map(p => ({ productId: p.id, quantity: p.quantity }))
    };
    return this.add(payload);
  }
}
