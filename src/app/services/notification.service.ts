import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private showPromptSubject = new BehaviorSubject<boolean>(false);
  showPrompt$ = this.showPromptSubject.asObservable();

  constructor() {
    // Do not hide alert here; we will control it from the component
  }

  allowNotifications(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🛍️ Thanks for enabling ngStore notifications!');
        }
      });
    }
    localStorage.setItem('notificationsBlocked', 'true');
    this.showPromptSubject.next(false);
  }

  blockNotifications(): void {
    localStorage.setItem('notificationsBlocked', 'true');
    this.showPromptSubject.next(false);
  }

  // Helper to trigger alert manually
  showPrompt(): void {
    const blocked = localStorage.getItem('notificationsBlocked') === 'true';
    const permissionGrantedOrDenied = 'Notification' in window &&
                                     (Notification.permission === 'granted' || Notification.permission === 'denied');
    if (!blocked && !permissionGrantedOrDenied) {
      this.showPromptSubject.next(true);
    }
  }
}
