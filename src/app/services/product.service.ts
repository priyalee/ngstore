import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient) {}

  // GET all products
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  // GET single product
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  // POST new product
  add(product: any): Observable<any> {
    return this.http.post<any>(this.api, product);
  }

  // PUT update product
  update(id: number, product: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, product);
  }

  // DELETE product
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }
}
