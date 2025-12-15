import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // A BehaviorSubject will hold the latest category selected
  private categorySelectedSource = new BehaviorSubject<string>('all');
  categorySelected$ = this.categorySelectedSource.asObservable();

  // Method to update category
  selectCategory(category: string): void {
    this.categorySelectedSource.next(category);
  }
}
