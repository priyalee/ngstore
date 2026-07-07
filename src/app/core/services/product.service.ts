import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, shareReplay, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private fakeStoreApi = 'https://fakestoreapi.com/products';
  private dummyJsonApi = 'https://dummyjson.com/products?limit=0';

  /** One shared request that aggregates BOTH product APIs into a unified catalog. */
  private all$?: Observable<any[]>;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    if (!this.all$) {
      this.all$ = forkJoin({
        fs: this.http.get<any[]>(this.fakeStoreApi).pipe(catchError(() => of([]))),
        dj: this.http.get<any>(this.dummyJsonApi).pipe(catchError(() => of({ products: [] }))),
      }).pipe(
        map(({ fs, dj }) => {
          const a = (fs || []).map(p => this.fromFakeStore(p));
          const b = (dj?.products || []).map((p: any) => this.fromDummyJson(p));
          return [...b, ...a];
        }),
        shareReplay(1)
      );
    }
    return this.all$;
  }

  getById(id: number): Observable<any> {
    return this.getAll().pipe(map(list => list.find(p => p.id === +id)));
  }

  getRelated(category: string, excludeId: number, limit = 4): Observable<any[]> {
    return this.getAll().pipe(
      map(list => list.filter(p => p.category === category && p.id !== +excludeId).slice(0, limit))
    );
  }

  /* ---------------- normalisation ---------------- */

  private round(n: number): number { return Math.round(n * 100) / 100; }

  private prettyCategory(raw: string): string {
    return (raw || 'other')
      .replace(/-/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private fromFakeStore(p: any): any {
    return {
      id: p.id, // 1..20
      title: p.title,
      price: this.round(p.price),
      originalPrice: this.round(p.price),
      discountPercentage: 0,
      description: p.description,
      category: this.prettyCategory(p.category),
      brand: null,
      image: p.image,
      images: [p.image],
      rating: { rate: p.rating?.rate ?? 0, count: p.rating?.count ?? 0 },
      stock: 12 + (p.id * 7) % 40,
      reviews: [],
      source: 'fakestore',
    };
  }

  private fromDummyJson(p: any): any {
    const disc = p.discountPercentage || 0;
    const list = this.round(p.price);
    const final = disc ? this.round(p.price * (1 - disc / 100)) : list;
    const reviews = (p.reviews || []).map((r: any) => ({
      name: r.reviewerName,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
    }));
    return {
      id: 1000 + p.id, // offset so it never collides with FakeStore ids
      title: p.title,
      price: final,
      originalPrice: list,
      discountPercentage: Math.round(disc),
      description: p.description,
      category: this.prettyCategory(p.category),
      brand: p.brand || null,
      image: p.thumbnail,
      images: (p.images && p.images.length ? p.images : [p.thumbnail]),
      rating: {
        rate: p.rating ?? 0,
        count: Math.round((p.rating ?? 4) * 32) + (p.id % 90) + reviews.length,
      },
      stock: p.stock ?? 0,
      reviews,
      source: 'dummyjson',
    };
  }
}
