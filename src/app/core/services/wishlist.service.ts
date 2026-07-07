import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storageKey = 'ngstore-wishlist';
  private items: any[] = this.read();
  private items$ = new BehaviorSubject<any[]>(this.items);

  count$ = this.items$.pipe(map(i => i.length));

  private read(): any[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private persist(): void {
    this.items$.next([...this.items]);
    try { localStorage.setItem(this.storageKey, JSON.stringify(this.items)); } catch {}
  }

  getAll(): Observable<any[]> {
    return this.items$.asObservable();
  }

  has(id: number): boolean {
    return this.items.some(p => p.id === id);
  }

  /** Returns the new state (true = now saved). */
  toggle(product: any): boolean {
    if (this.has(product.id)) {
      this.remove(product.id);
      return false;
    }
    this.items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    });
    this.persist();
    return true;
  }

  remove(id: number): void {
    this.items = this.items.filter(p => p.id !== id);
    this.persist();
  }

  clear(): void {
    this.items = [];
    this.persist();
  }
}
