import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  // 🔹 Category filter stream
  private categorySubject = new BehaviorSubject<string | null>(null);
  category$ = this.categorySubject.asObservable();

  // 🔹 Search filter stream
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  //  Set selected category
  setCategory(category: string): void {
    this.categorySubject.next(category);
  }

  // Set search text
  setSearch(query: string): void {
    this.searchSubject.next(query);
  }
}