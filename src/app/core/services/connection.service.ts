import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Tracks browser online/offline status for the global connection error page. */
@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private onlineSubject = new BehaviorSubject<boolean>(this.readInitial());
  online$ = this.onlineSubject.asObservable();

  constructor(private zone: NgZone) {
    window.addEventListener('online', () => this.zone.run(() => this.onlineSubject.next(true)));
    window.addEventListener('offline', () => this.zone.run(() => this.onlineSubject.next(false)));
  }

  private readInitial(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  get isOnline(): boolean {
    return this.onlineSubject.value;
  }

  /** Called by the HTTP interceptor when a request fails with a network error. */
  reportOffline(): void {
    if (this.onlineSubject.value) this.onlineSubject.next(false);
  }

  /** Re-check connectivity (used by the "Try again" button). */
  recheck(): boolean {
    const online = this.readInitial();
    this.onlineSubject.next(online);
    return online;
  }
}
