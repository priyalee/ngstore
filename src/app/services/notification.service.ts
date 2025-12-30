import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private showPromptSubject = new BehaviorSubject<boolean>(false);
  showPrompt$ = this.showPromptSubject.asObservable();

  showPrompt(): void {
    const blocked = localStorage.getItem('notificationsBlocked') === 'true';

    if (!blocked && 'Notification' in window && Notification.permission === 'default') {
      this.showPromptSubject.next(true);
    }
  }

  allowNotifications(): void {
    if (!('Notification' in window)) return;

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('🛍️ NG Store notifications enabled!');
      }
    });

    this.showPromptSubject.next(false);
  }

  blockNotifications(): void {
    localStorage.setItem('notificationsBlocked', 'true');
    this.showPromptSubject.next(false);
  }
}
