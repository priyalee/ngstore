import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  icon: string;
  type: 'success' | 'info' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: Toast['type'] = 'success', icon = 'fa-solid fa-circle-check'): void {
    this.toastSubject.next({ id: ++this.counter, message, type, icon });
  }

  cart(message: string): void {
    this.show(message, 'success', 'fa-solid fa-cart-shopping');
  }
}
