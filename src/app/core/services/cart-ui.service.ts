import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Controls the slide-out mini-cart drawer. */
@Injectable({ providedIn: 'root' })
export class CartUiService {
  private openSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.openSubject.asObservable();

  open(): void { this.openSubject.next(true); }
  close(): void { this.openSubject.next(false); }
  toggle(): void { this.openSubject.next(!this.openSubject.value); }
}
