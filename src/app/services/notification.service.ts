import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private showPromptSubject = new BehaviorSubject<boolean>(false);
  showPrompt$ = this.showPromptSubject.asObservable();

  // Called on page load
  showPrompt(): void {
    const blocked = localStorage.getItem('notificationsBlocked') === 'true';

    if (!blocked) {
      this.showPromptSubject.next(true);
    }
  }

  // Trigger ONLY on user click
  allowNotifications(): void {
    if (!('Notification' in window)) return;

    Notification.requestPermission().then(permission => {
      console.log('Permission:', permission);

      if (permission === 'granted') {
        new Notification('🛍️ NG Store notifications enabled!');
      }
    });

    this.showPromptSubject.next(false);
  }

  // User clicked No Thanks
  blockNotifications(): void {
    localStorage.setItem('notificationsBlocked', 'true');
    this.showPromptSubject.next(false);
  }
}
