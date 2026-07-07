import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrderItem {
  title: string;
  qty: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: OrderItem[];
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly storageKey = 'ngstore-orders';
  private orders$ = new BehaviorSubject<Order[]>(this.read());

  private read(): Order[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    // Seed with a couple of demo orders so the page isn't empty on first visit.
    const seed = this.seed();
    try { localStorage.setItem(this.storageKey, JSON.stringify(seed)); } catch {}
    return seed;
  }

  private seed(): Order[] {
    return [
      {
        id: 'NG-100482', date: 'Jul 2, 2026', status: 'delivered', total: 129.97,
        items: [
          { title: 'Wireless Noise-Cancelling Headphones', qty: 1, price: 89.99 },
          { title: 'USB-C Fast Charging Cable (2m)', qty: 2, price: 19.99 },
        ],
      },
      {
        id: 'NG-100455', date: 'Jul 4, 2026', status: 'shipped', total: 249.00,
        items: [{ title: 'Smart Fitness Watch — Series 6', qty: 1, price: 249.00 }],
      },
    ];
  }

  private persist(list: Order[]): void {
    this.orders$.next(list);
    try { localStorage.setItem(this.storageKey, JSON.stringify(list)); } catch {}
  }

  getAll(): Observable<Order[]> {
    return this.orders$.asObservable();
  }

  place(order: Omit<Order, 'id' | 'date' | 'status'>): Order {
    const now = new Date();
    const full: Order = {
      ...order,
      id: 'NG-' + now.getTime().toString().slice(-6),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'processing',
    };
    this.persist([full, ...this.orders$.value]);
    return full;
  }
}
